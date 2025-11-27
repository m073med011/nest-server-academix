import { OtpRepository } from './otp.repository';
export declare class OtpService {
    private readonly otpRepository;
    constructor(otpRepository: OtpRepository);
    create(createOtpDto: any): Promise<import("./schemas/otp.schema").OtpDocument>;
    findByEmailAndPurpose(email: string, purpose: string): Promise<import("./schemas/otp.schema").OtpDocument | null>;
    verify(id: string): Promise<import("./schemas/otp.schema").OtpDocument | null>;
    incrementAttempts(id: string): Promise<import("./schemas/otp.schema").OtpDocument | null>;
    remove(id: string): Promise<import("./schemas/otp.schema").OtpDocument | null>;
}
