import { OtpService } from './otp.service';
export declare class OtpController {
    private readonly otpService;
    constructor(otpService: OtpService);
    generate(generateOtpDto: any): Promise<import("./schemas/otp.schema").OtpDocument>;
    verify(verifyOtpDto: any): {
        status: string;
    };
}
