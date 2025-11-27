"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BrevoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrevoService = exports.OtpPurpose = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const brevo_1 = require("@getbrevo/brevo");
var OtpPurpose;
(function (OtpPurpose) {
    OtpPurpose["EMAIL_VERIFICATION"] = "email_verification";
    OtpPurpose["PASSWORD_RESET"] = "password_reset";
    OtpPurpose["TWO_FACTOR_AUTH"] = "two_factor_auth";
})(OtpPurpose || (exports.OtpPurpose = OtpPurpose = {}));
let BrevoService = BrevoService_1 = class BrevoService {
    configService;
    apiInstance;
    logger = new common_1.Logger(BrevoService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.apiInstance = new brevo_1.TransactionalEmailsApi();
        const apiKey = this.configService.get('brevo.apiKey');
        if (apiKey) {
            this.apiInstance.setApiKey(0, apiKey);
        }
        else {
            this.logger.warn('Brevo API Key is not configured');
        }
    }
    async sendOtpEmail(email, code, purpose) {
        const apiKey = this.configService.get('brevo.apiKey');
        const senderEmail = this.configService.get('brevo.senderEmail');
        const senderName = this.configService.get('brevo.senderName');
        if (!apiKey || !senderEmail) {
            this.logger.error('Brevo configuration missing');
            throw new Error('Brevo configuration missing');
        }
        try {
            this.logger.log(`Sending OTP email to ${email} for ${purpose}`);
            const { subject, htmlContent, textContent } = this.getEmailTemplate(code, purpose);
            const sendSmtpEmail = new brevo_1.SendSmtpEmail();
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
        }
        catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`, error.stack);
            throw new Error(`Failed to send OTP email: ${error.message}`);
        }
    }
    getEmailTemplate(code, purpose) {
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
    getEmailVerificationTemplate(code) {
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
    getTwoFactorAuthTemplate(code) {
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
    getPasswordResetTemplate(code) {
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
    getDefaultTemplate(code) {
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
};
exports.BrevoService = BrevoService;
exports.BrevoService = BrevoService = BrevoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BrevoService);
//# sourceMappingURL=brevo.service.js.map