import crypto from 'crypto';
import { ENV } from '../../config/env.js';

export interface GeneratedOtp {
  code: string;
  codeHash: string;
  expiresAt: Date;
}

export class OtpSecurity {
  /**
   * Generates a 6-digit numeric OTP for Super Admin and Admin
   */
  static generateAdminOtp(): GeneratedOtp {
    const min = 100000;
    const max = 999999;
    const code = crypto.randomInt(min, max + 1).toString();
    const codeHash = this.hashCode(code);
    const expiresAt = new Date(Date.now() + ENV.OTP_EXPIRY_MINUTES * 60 * 1000);

    return { code, codeHash, expiresAt };
  }

  /**
   * Generates an 8-character uppercase alphanumeric OTP for Elites
   * E.g. "K9F4T2W8"
   */
  static generateEliteOtp(): GeneratedOtp {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes ambiguous characters (0, O, 1, I)
    const length = 8;
    const randomBytes = crypto.randomBytes(length);
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars[randomBytes[i] % chars.length];
    }
    const codeHash = this.hashCode(code);
    const expiresAt = new Date(Date.now() + ENV.OTP_EXPIRY_MINUTES * 60 * 1000);

    return { code, codeHash, expiresAt };
  }

  static hashCode(code: string): string {
    return crypto.createHash('sha256').update(code.trim().toUpperCase()).digest('hex');
  }

  static verify(inputCode: string, storedHash: string): boolean {
    const inputHash = this.hashCode(inputCode);
    return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(storedHash));
  }
}
