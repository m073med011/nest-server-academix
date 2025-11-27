import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';

export enum OtpPurpose {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  TWO_FACTOR_AUTH = 'two_factor_auth',
}

@Injectable()
export class BrevoService {
  private apiInstance: TransactionalEmailsApi;
  private readonly logger = new Logger(BrevoService.name);

  constructor(private readonly configService: ConfigService) {
    this.apiInstance = new TransactionalEmailsApi();
    const apiKey = this.configService.get<string>('brevo.apiKey');
    if (apiKey) {
      this.apiInstance.setApiKey(0, apiKey);
    } else {
      this.logger.warn('Brevo API Key is not configured');
    }
  }

  async sendOtpEmail(
    email: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    const apiKey = this.configService.get<string>('brevo.apiKey');
    const senderEmail = this.configService.get<string>('brevo.senderEmail');
    const senderName = this.configService.get<string>('brevo.senderName');

    if (!apiKey || !senderEmail) {
      this.logger.error('Brevo configuration missing');
      throw new Error('Brevo configuration missing');
    }

    try {
      this.logger.log(`Sending OTP email to ${email} for ${purpose}`);

      const { subject, htmlContent, textContent } = this.getEmailTemplate(
        code,
        purpose,
      );

      const sendSmtpEmail = new SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.textContent = textContent;
      sendSmtpEmail.sender = {
        name: senderName || 'Academix',
        email: senderEmail,
      };
      sendSmtpEmail.to = [{ email }];

      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log('Email sent successfully');
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  private getEmailTemplate(
    code: string,
    purpose: OtpPurpose,
  ): {
    subject: string;
    htmlContent: string;
    textContent: string;
  } {
    const baseSubject = 'Your Academix Verification Code';
    const baseText = `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`;

    switch (purpose) {
      case OtpPurpose.EMAIL_VERIFICATION:
        return {
          subject: `${baseSubject} - Email Verification`,
          htmlContent: this.getEmailVerificationTemplate(code),
          textContent: `Email Verification\n\n${baseText}`,
        };

      case OtpPurpose.TWO_FACTOR_AUTH:
        return {
          subject: `${baseSubject} - Two-Factor Authentication`,
          htmlContent: this.getTwoFactorAuthTemplate(code),
          textContent: `Two-Factor Authentication\n\n${baseText}`,
        };

      case OtpPurpose.PASSWORD_RESET:
        return {
          subject: `${baseSubject} - Password Reset`,
          htmlContent: this.getPasswordResetTemplate(code),
          textContent: `Password Reset\n\n${baseText}`,
        };

      default:
        return {
          subject: baseSubject,
          htmlContent: this.getDefaultTemplate(code),
          textContent: baseText,
        };
    }
  }

  private getEmailVerificationTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification - Academix</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #3b82f6; text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 8px; letter-spacing: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Academix!</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up with Academix. To complete your registration, please verify your email address using the code below:</p>
            
            <div class="otp-code">${code}</div>
            
            <p><strong>This code will expire in 10 minutes.</strong></p>
            
            <p>If you didn't create an account with Academix, please ignore this email.</p>
            
            <p>Best regards,<br>The Academix Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getTwoFactorAuthTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Two-Factor Authentication - Academix</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 8px; letter-spacing: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Two-Factor Authentication</h1>
          </div>
          <div class="content">
            <h2>Your Security Code</h2>
            <p>Someone is trying to sign in to your Academix account. For your security, please use the code below to complete the sign-in process:</p>
            
            <div class="otp-code">${code}</div>
            
            <p><strong>This code will expire in 10 minutes.</strong></p>
            
            <p>If you didn't try to sign in, please secure your account immediately by changing your password.</p>
            
            <p>Best regards,<br>The Academix Security Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - Academix</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #ef4444; text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 8px; letter-spacing: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your Academix account password. Use the code below to verify your identity and reset your password:</p>
            
            <div class="otp-code">${code}</div>
            
            <p><strong>This code will expire in 10 minutes.</strong></p>
            
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>Best regards,<br>The Academix Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getDefaultTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verification Code - Academix</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6b7280; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #6b7280; text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 8px; letter-spacing: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Academix Verification</h1>
          </div>
          <div class="content">
            <h2>Your Verification Code</h2>
            <p>Please use the code below to complete your request:</p>
            
            <div class="otp-code">${code}</div>
            
            <p><strong>This code will expire in 10 minutes.</strong></p>
            
            <p>If you didn't request this code, please ignore this email.</p>
            
            <p>Best regards,<br>The Academix Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
