import { ConfigService } from '@nestjs/config';
import { OtpRepository } from './otp.repository';
import { BrevoService } from '../email/brevo.service';
import { OtpPurpose } from './schemas/otp.schema';
export declare class OtpService {
    private readonly otpRepository;
    private readonly brevoService;
    private readonly configService;
    private readonly logger;
    constructor(otpRepository: OtpRepository, brevoService: BrevoService, configService: ConfigService);
    generateOtp(email: string, purpose: OtpPurpose): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(email: string, code: string, purpose: OtpPurpose): Promise<{
        success: boolean;
        message: string;
        verified: boolean;
    }>;
    private generateSecureOtpCode;
    remove(id: string): Promise<void>;
    findByEmailAndPurpose(email: string, purpose: string): Promise<import("./schemas/otp.schema").OtpDocument | null>;
}
