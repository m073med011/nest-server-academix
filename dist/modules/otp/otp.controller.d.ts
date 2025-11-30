import { OtpService } from './otp.service';
import { GenerateOtpDto, VerifyOtpDto, ResendOtpDto } from './dto/otp.dto';
export declare class OtpController {
    private readonly otpService;
    constructor(otpService: OtpService);
    generate(generateOtpDto: GenerateOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verify(verifyOtpDto: VerifyOtpDto): Promise<{
        success: boolean;
        message: string;
        verified: boolean;
    }>;
    resend(resendOtpDto: ResendOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
