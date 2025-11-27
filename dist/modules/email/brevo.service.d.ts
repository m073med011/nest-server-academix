import { ConfigService } from '@nestjs/config';
export declare enum OtpPurpose {
    EMAIL_VERIFICATION = "email_verification",
    PASSWORD_RESET = "password_reset",
    TWO_FACTOR_AUTH = "two_factor_auth"
}
export declare class BrevoService {
    private readonly configService;
    private apiInstance;
    private readonly logger;
    constructor(configService: ConfigService);
    sendOtpEmail(email: string, code: string, purpose: OtpPurpose): Promise<void>;
    private getEmailTemplate;
    private getEmailVerificationTemplate;
    private getTwoFactorAuthTemplate;
    private getPasswordResetTemplate;
    private getDefaultTemplate;
}
