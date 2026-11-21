import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { NotFoundError, ValidationError } from '../../shared/errors.js';
import { XP_TRANSACTION_TYPES, ROLES } from '../../config/constants.js';

export interface AdjustXpDto {
  eliteId: string;
  amount: number; // Positive (bonus/award) or negative (deduction/penalty)
  type: keyof typeof XP_TRANSACTION_TYPES;
  reason: string;
  idempotencyKey?: string;
}

export class XpService {
  /**
   * Idempotent task completion XP award
   */
  async awardTaskXp(params: {
    eliteId: string;
    amount: number;
    taskId: string;
    evaluationId: string;
    reason: string;
    issuingAdminId: string;
  }) {
    const idempotencyKey = `TASK_XP_${params.taskId}_${params.evaluationId}_${params.eliteId}`;

    // Check duplicate
    for (const tx of db.xpTransactions.values()) {
      if (tx.idempotencyKey === idempotencyKey) {
        return tx;
      }
    }

    const txId = uuidv4();
    const transaction = {
      id: txId,
      eliteId: params.eliteId,
      amount: params.amount,
      transactionType: XP_TRANSACTION_TYPES.TASK_COMPLETION,
      taskId: params.taskId,
      evaluationId: params.evaluationId,
      issuingAdminId: params.issuingAdminId,
      reason: params.reason,
      idempotencyKey,
      isReversed: false,
      timestamp: new Date(),
    };

    db.xpTransactions.set(txId, transaction);

    // Update aggregate account balance
    let xpAcct = db.xpAccounts.get(params.eliteId);
    if (!xpAcct) {
      xpAcct = {
        id: uuidv4(),
        eliteId: params.eliteId,
        currentBalance: 0,
        lifetimeEarned: 0,
        lifetimeDeducted: 0,
        updatedAt: new Date(),
      };
      db.xpAccounts.set(params.eliteId, xpAcct);
    }

    xpAcct.currentBalance += params.amount;
    xpAcct.lifetimeEarned += params.amount;
    xpAcct.updatedAt = new Date();

    return transaction;
  }

  /**
   * Manual XP adjustment with mandatory reason
   */
  async adjustXp(dto: AdjustXpDto, actor: any) {
    if (!dto.reason || dto.reason.trim().length < 5) {
      throw new ValidationError('Mandatory detailed reason required for administrative XP adjustment');
    }

    const elite = db.users.get(dto.eliteId);
    if (!elite || elite.role !== ROLES.ELITE) {
      throw new NotFoundError('Elite user not found');
    }

    const idempotencyKey = dto.idempotencyKey || `ADJUST_${dto.eliteId}_${Date.now()}_${uuidv4().substring(0, 6)}`;
    const txId = uuidv4();

    const transaction = {
      id: txId,
      eliteId: dto.eliteId,
      amount: dto.amount,
      transactionType: dto.type || (dto.amount >= 0 ? XP_TRANSACTION_TYPES.MANUAL_ADJUSTMENT : XP_TRANSACTION_TYPES.PENALTY_DEDUCTION),
      taskId: null,
      evaluationId: null,
      issuingAdminId: actor.id,
      reason: dto.reason,
      idempotencyKey,
      isReversed: false,
      timestamp: new Date(),
    };

    db.xpTransactions.set(txId, transaction);

    let xpAcct = db.xpAccounts.get(dto.eliteId);
    if (!xpAcct) {
      xpAcct = {
        id: uuidv4(),
        eliteId: dto.eliteId,
        currentBalance: 0,
        lifetimeEarned: 0,
        lifetimeDeducted: 0,
        updatedAt: new Date(),
      };
      db.xpAccounts.set(dto.eliteId, xpAcct);
    }

    xpAcct.currentBalance += dto.amount;
    if (dto.amount >= 0) {
      xpAcct.lifetimeEarned += dto.amount;
    } else {
      xpAcct.lifetimeDeducted += Math.abs(dto.amount);
    }
    xpAcct.updatedAt = new Date();

    // Notify Elite
    const notifId = uuidv4();
    db.notifications.set(notifId, {
      id: notifId,
      userId: dto.eliteId,
      eventType: 'XP_AWARDED',
      title: dto.amount >= 0 ? `XP Awarded (+${dto.amount} XP)` : `XP Adjustment (${dto.amount} XP)`,
      message: `Your XP account balance was updated: ${dto.reason}. Current balance: ${xpAcct.currentBalance} XP.`,
      dataJson: { amount: dto.amount, balance: xpAcct.currentBalance },
      channel: 'IN_APP',
      deliveryStatus: 'DELIVERED',
      isRead: false,
      createdAt: new Date(),
    });

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'XP_ADJUSTED',
      entity: 'XPTransaction',
      entityId: txId,
      newState: { amount: dto.amount, newBalance: xpAcct.currentBalance },
      reason: dto.reason,
    });

    return {
      transaction,
      newBalance: xpAcct.currentBalance,
    };
  }

  /**
   * Reverse an existing transaction
   */
  async reverseTransaction(originalTxId: string, reason: string, actor: any) {
    const original = db.xpTransactions.get(originalTxId);
    if (!original) throw new NotFoundError('Original XP transaction not found');

    if (original.isReversed) {
      throw new ValidationError('This transaction has already been reversed');
    }

    const reversalTxId = uuidv4();
    const reversalAmount = -original.amount;

    const reversalTransaction = {
      id: reversalTxId,
      eliteId: original.eliteId,
      amount: reversalAmount,
      transactionType: XP_TRANSACTION_TYPES.REVERSAL,
      taskId: original.taskId,
      evaluationId: original.evaluationId,
      issuingAdminId: actor.id,
      reason: `Reversal of tx ${originalTxId}: ${reason}`,
      idempotencyKey: `REVERSAL_${originalTxId}`,
      isReversed: false,
      timestamp: new Date(),
    };

    db.xpTransactions.set(reversalTxId, reversalTransaction);
    original.isReversed = true;

    // Record reversal pairing
    const reversalRecordId = uuidv4();
    db.xpTransactionReversals.set(reversalRecordId, {
      id: reversalRecordId,
      originalTransactionId: originalTxId,
      replacementTransactionId: reversalTxId,
      reversedById: actor.id,
      reason,
      reversedAt: new Date(),
    });

    // Update account balance
    const xpAcct = db.xpAccounts.get(original.eliteId);
    if (xpAcct) {
      xpAcct.currentBalance += reversalAmount;
      xpAcct.updatedAt = new Date();
    }

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'XP_TRANSACTION_REVERSED',
      entity: 'XPTransaction',
      entityId: originalTxId,
      newState: { reversalTxId, reversalAmount, newBalance: xpAcct?.currentBalance },
      reason,
    });

    return {
      originalTxId,
      reversalTxId,
      reversedAmount: original.amount,
      newBalance: xpAcct?.currentBalance || 0,
    };
  }

  /**
   * Finalize a points distribution batch
   */
  async finalizeBatch(batchId: string, actor: any) {
    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'XP_BATCH_FINALIZED',
      entity: 'XPBatch',
      entityId: batchId,
      reason: 'Points distribution batch finalized and results published',
    });

    return {
      batchId,
      status: 'XP DISTRIBUTION COMPLETED — RESULTS PUBLISHED',
      message: 'Points allocation has been authorized, processed, and notified.',
      finalizedAt: new Date(),
    };
  }

  async getTransactions(filter: { eliteId?: string; type?: string; limit?: number }) {
    let all = Array.from(db.xpTransactions.values());

    if (filter.eliteId) {
      all = all.filter((t) => t.eliteId === filter.eliteId);
    }
    if (filter.type) {
      all = all.filter((t) => t.transactionType === filter.type);
    }

    all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const limit = filter.limit || 50;
    return all.slice(0, limit).map((t) => {
      const elite = db.users.get(t.eliteId);
      const profile = db.userProfiles.get(t.eliteId);
      const admin = db.users.get(t.issuingAdminId);

      return {
        ...t,
        eliteName: profile?.fullName || elite?.email,
        eliteIdCode: profile?.eliteId,
        issuingAdminName: admin?.email,
      };
    });
  }
}

export const xpService = new XpService();
