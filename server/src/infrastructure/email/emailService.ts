import { Resend } from 'resend';
import { ENV } from '../../config/env.js';
import { v4 as uuidv4 } from 'uuid';

export interface EmailDeliveryRecord {
  id: string;
  to: string;
  subject: string;
  template: string;
  payload: any;
  status: 'SENT' | 'PREP_MODE_LOGGED' | 'FAILED';
  error?: string;
  timestamp: Date;
}

export class EmailService {
  private resendClient: Resend | null = null;
  public deliveryLogs: EmailDeliveryRecord[] = [];

  constructor() {
    if (ENV.RESEND_API_KEY) {
      this.resendClient = new Resend(ENV.RESEND_API_KEY);
    }
  }

  private getClient(): Resend | null {
    if (!this.resendClient && ENV.RESEND_API_KEY) {
      this.resendClient = new Resend(ENV.RESEND_API_KEY);
    }
    return this.resendClient;
  }

  public isConfigured(): boolean {
    return Boolean(ENV.RESEND_API_KEY && ENV.RESEND_API_KEY.startsWith('re_'));
  }

  public async sendOtpEmail(to: string, otpCode: string, recipientRole: string): Promise<EmailDeliveryRecord> {
    const subject = `Your Thread Elite OTP Verification Code: ${otpCode}`;
    const body = `
Hello,

Your single-use Thread Elite authentication OTP code is:

  ${otpCode}

This code will expire in ${ENV.OTP_EXPIRY_MINUTES} minutes.
Role scope: ${recipientRole}

If you did not request this verification, please contact system administration immediately.

— Thread Security Program Office
`;
    return this.dispatchEmail(to, subject, 'OTP_VERIFICATION', { otpCode, recipientRole }, body);
  }

  public async sendAccountActivationEmail(to: string, setupLink: string, role: string): Promise<EmailDeliveryRecord> {
    const subject = `Welcome to Thread Elite — Account Activation Instructions`;
    const body = `
Hello,

You have been granted access to the Thread Elite Program Platform as a ${role}.

Please complete your account activation and password setup here:
${setupLink}

— Thread Security Program Office
`;
    return this.dispatchEmail(to, subject, 'ACCOUNT_ACTIVATION', { setupLink, role }, body);
  }

  public async sendNotificationEmail(to: string, subject: string, message: string, meta?: any): Promise<EmailDeliveryRecord> {
    return this.dispatchEmail(to, subject, 'SYSTEM_NOTIFICATION', meta, message);
  }

  private async dispatchEmail(
    to: string,
    subject: string,
    template: string,
    payload: any,
    textBody: string
  ): Promise<EmailDeliveryRecord> {
    const recordId = uuidv4();

    const client = this.getClient();
    if (!this.isConfigured() || !client) {
      const record: EmailDeliveryRecord = {
        id: recordId,
        to,
        subject,
        template,
        payload,
        status: 'PREP_MODE_LOGGED',
        timestamp: new Date(),
      };
      this.deliveryLogs.push(record);
      return record;
    }

    try {
      await client.emails.send({
        from: ENV.EMAIL_FROM || 'onboarding@resend.dev',
        to,
        subject,
        text: textBody,
      });

      const record: EmailDeliveryRecord = {
        id: recordId,
        to,
        subject,
        template,
        payload,
        status: 'SENT',
        timestamp: new Date(),
      };
      this.deliveryLogs.push(record);
      return record;
    } catch (err: any) {
      const record: EmailDeliveryRecord = {
        id: recordId,
        to,
        subject,
        template,
        payload,
        status: 'FAILED',
        error: err?.message || 'Resend API dispatch failed',
        timestamp: new Date(),
      };
      this.deliveryLogs.push(record);
      return record;
    }
  }
}

export const emailService = new EmailService();
