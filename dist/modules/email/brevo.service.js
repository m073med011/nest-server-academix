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
        const apiKey = this.configService.get('app.brevo.apiKey');
        if (apiKey) {
            this.apiInstance.setApiKey(0, apiKey);
        }
        else {
            this.logger.warn('Brevo API Key is not configured');
        }
    }
    async sendOtpEmail(email, code, purpose) {
        const apiKey = this.configService.get('app.brevo.apiKey');
        const senderEmail = this.configService.get('app.brevo.senderEmail');
        const senderName = this.configService.get('app.brevo.senderName');
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
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Email Verification - Academix</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 48px 40px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .header p {
            margin-top: 8px;
            font-size: 16px;
            opacity: 0.95;
            font-weight: 400;
          }
          .content {
            padding: 48px 40px;
            background: #ffffff;
          }
          .content h2 {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
            letter-spacing: -0.3px;
          }
          .content p {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 24px;
            line-height: 1.7;
          }
          .otp-container {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border-radius: 12px;
            padding: 32px;
            margin: 32px 0;
            text-align: center;
            border: 2px dashed #d1d5db;
          }
          .otp-label {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6b7280;
            margin-bottom: 12px;
          }
          .otp-code {
            font-size: 40px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            user-select: all;
          }
          .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .warning-box p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
            font-weight: 500;
          }
          .info-box {
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .info-box p {
            margin: 0;
            color: #1e40af;
            font-size: 14px;
          }
          .footer {
            background: #f9fafb;
            text-align: center;
            padding: 32px 40px;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            color: #6b7280;
            font-size: 13px;
            margin: 0;
            line-height: 1.6;
          }
          .footer a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
          }
          @media only screen and (max-width: 600px) {
            body { padding: 20px 10px; }
            .header, .content, .footer { padding: 32px 24px; }
            .header h1 { font-size: 24px; }
            .content h2 { font-size: 20px; }
            .otp-code { font-size: 32px; letter-spacing: 6px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>🎓 Welcome to Academix!</h1>
            <p>Verify your email to get started</p>
          </div>
          <div class="content">
            <h2>Email Verification</h2>
            <p>Thank you for joining Academix! We're excited to have you on board. To complete your registration and unlock all features, please verify your email address using the code below:</p>

            <div class="otp-container">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp-code">${code}</div>
            </div>

            <div class="warning-box">
              <p>⏱️ This code will expire in 10 minutes for security reasons.</p>
            </div>

            <div class="info-box">
              <p>🔒 If you didn't create an account with Academix, you can safely ignore this email. Your security is our priority.</p>
            </div>

            <p style="margin-top: 32px; color: #111827; font-weight: 500;">Best regards,<br>The Academix Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p style="margin-top: 8px;">Need help? <a href="mailto:support@academix.com">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    getTwoFactorAuthTemplate(code) {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Two-Factor Authentication - Academix</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 20px;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 48px 40px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .header p {
            margin-top: 8px;
            font-size: 16px;
            opacity: 0.95;
            font-weight: 400;
          }
          .content {
            padding: 48px 40px;
            background: #ffffff;
          }
          .content h2 {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
            letter-spacing: -0.3px;
          }
          .content p {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 24px;
            line-height: 1.7;
          }
          .otp-container {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-radius: 12px;
            padding: 32px;
            margin: 32px 0;
            text-align: center;
            border: 2px dashed #6ee7b7;
          }
          .otp-label {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #065f46;
            margin-bottom: 12px;
          }
          .otp-code {
            font-size: 40px;
            font-weight: 700;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            user-select: all;
          }
          .alert-box {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .alert-box p {
            margin: 0;
            color: #991b1b;
            font-size: 14px;
            font-weight: 500;
          }
          .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .warning-box p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
            font-weight: 500;
          }
          .footer {
            background: #f9fafb;
            text-align: center;
            padding: 32px 40px;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            color: #6b7280;
            font-size: 13px;
            margin: 0;
            line-height: 1.6;
          }
          .footer a {
            color: #10b981;
            text-decoration: none;
            font-weight: 500;
          }
          @media only screen and (max-width: 600px) {
            body { padding: 20px 10px; }
            .header, .content, .footer { padding: 32px 24px; }
            .header h1 { font-size: 24px; }
            .content h2 { font-size: 20px; }
            .otp-code { font-size: 32px; letter-spacing: 6px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>🔐 Two-Factor Authentication</h1>
            <p>Secure your account access</p>
          </div>
          <div class="content">
            <h2>Security Verification Required</h2>
            <p>Someone is attempting to sign in to your Academix account. For your protection, please use the verification code below to complete the sign-in process:</p>

            <div class="otp-container">
              <div class="otp-label">Your Security Code</div>
              <div class="otp-code">${code}</div>
            </div>

            <div class="warning-box">
              <p>⏱️ This code will expire in 10 minutes for security reasons.</p>
            </div>

            <div class="alert-box">
              <p>⚠️ If you didn't attempt to sign in, please secure your account immediately by changing your password and enabling additional security measures.</p>
            </div>

            <p style="margin-top: 32px; color: #111827; font-weight: 500;">Stay secure,<br>The Academix Security Team</p>
          </div>
          <div class="footer">
            <p>This is an automated security message, please do not reply to this email.</p>
            <p style="margin-top: 8px;">Security concerns? <a href="mailto:security@academix.com">Contact Security Team</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    getPasswordResetTemplate(code) {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Password Reset - Academix</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
            padding: 40px 20px;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
            color: white;
            padding: 48px 40px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .header p {
            margin-top: 8px;
            font-size: 16px;
            opacity: 0.95;
            font-weight: 400;
          }
          .content {
            padding: 48px 40px;
            background: #ffffff;
          }
          .content h2 {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
            letter-spacing: -0.3px;
          }
          .content p {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 24px;
            line-height: 1.7;
          }
          .otp-container {
            background: linear-gradient(135deg, #fecdd3 0%, #fda4af 100%);
            border-radius: 12px;
            padding: 32px;
            margin: 32px 0;
            text-align: center;
            border: 2px dashed #fb7185;
          }
          .otp-label {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #881337;
            margin-bottom: 12px;
          }
          .otp-code {
            font-size: 40px;
            font-weight: 700;
            background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            user-select: all;
          }
          .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .warning-box p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
            font-weight: 500;
          }
          .info-box {
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .info-box p {
            margin: 0;
            color: #1e40af;
            font-size: 14px;
          }
          .footer {
            background: #f9fafb;
            text-align: center;
            padding: 32px 40px;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            color: #6b7280;
            font-size: 13px;
            margin: 0;
            line-height: 1.6;
          }
          .footer a {
            color: #f43f5e;
            text-decoration: none;
            font-weight: 500;
          }
          @media only screen and (max-width: 600px) {
            body { padding: 20px 10px; }
            .header, .content, .footer { padding: 32px 24px; }
            .header h1 { font-size: 24px; }
            .content h2 { font-size: 20px; }
            .otp-code { font-size: 32px; letter-spacing: 6px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>🔑 Password Reset Request</h1>
            <p>Reset your account password</p>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your Academix account password. To proceed with resetting your password, please use the verification code below:</p>

            <div class="otp-container">
              <div class="otp-label">Your Reset Code</div>
              <div class="otp-code">${code}</div>
            </div>

            <div class="warning-box">
              <p>⏱️ This code will expire in 10 minutes for security reasons.</p>
            </div>

            <div class="info-box">
              <p>💡 If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged and your account stays secure.</p>
            </div>

            <p style="margin-top: 32px; color: #111827; font-weight: 500;">Best regards,<br>The Academix Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p style="margin-top: 8px;">Need help? <a href="mailto:support@academix.com">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    getDefaultTemplate(code) {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Verification Code - Academix</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            padding: 40px 20px;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 48px 40px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .header p {
            margin-top: 8px;
            font-size: 16px;
            opacity: 0.95;
            font-weight: 400;
          }
          .content {
            padding: 48px 40px;
            background: #ffffff;
          }
          .content h2 {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
            letter-spacing: -0.3px;
          }
          .content p {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 24px;
            line-height: 1.7;
          }
          .otp-container {
            background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
            border-radius: 12px;
            padding: 32px;
            margin: 32px 0;
            text-align: center;
            border: 2px dashed #a5b4fc;
          }
          .otp-label {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #3730a3;
            margin-bottom: 12px;
          }
          .otp-code {
            font-size: 40px;
            font-weight: 700;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            user-select: all;
          }
          .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .warning-box p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
            font-weight: 500;
          }
          .info-box {
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .info-box p {
            margin: 0;
            color: #1e40af;
            font-size: 14px;
          }
          .footer {
            background: #f9fafb;
            text-align: center;
            padding: 32px 40px;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            color: #6b7280;
            font-size: 13px;
            margin: 0;
            line-height: 1.6;
          }
          .footer a {
            color: #6366f1;
            text-decoration: none;
            font-weight: 500;
          }
          @media only screen and (max-width: 600px) {
            body { padding: 20px 10px; }
            .header, .content, .footer { padding: 32px 24px; }
            .header h1 { font-size: 24px; }
            .content h2 { font-size: 20px; }
            .otp-code { font-size: 32px; letter-spacing: 6px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>✉️ Academix Verification</h1>
            <p>Secure verification code</p>
          </div>
          <div class="content">
            <h2>Your Verification Code</h2>
            <p>We've received a request that requires verification. Please use the code below to complete your request:</p>

            <div class="otp-container">
              <div class="otp-label">Verification Code</div>
              <div class="otp-code">${code}</div>
            </div>

            <div class="warning-box">
              <p>⏱️ This code will expire in 10 minutes for security reasons.</p>
            </div>

            <div class="info-box">
              <p>🔒 If you didn't request this code, you can safely ignore this email.</p>
            </div>

            <p style="margin-top: 32px; color: #111827; font-weight: 500;">Best regards,<br>The Academix Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p style="margin-top: 8px;">Need help? <a href="mailto:support@academix.com">Contact Support</a></p>
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