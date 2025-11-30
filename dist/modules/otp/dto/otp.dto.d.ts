import { OtpPurpose } from '../schemas/otp.schema';
export declare class GenerateOtpDto {
    email: string;
    purpose: OtpPurpose;
}
export declare class VerifyOtpDto {
    email: string;
    code: string;
    purpose: OtpPurpose;
}
export declare class ResendOtpDto {
    email: string;
    purpose: OtpPurpose;
}
