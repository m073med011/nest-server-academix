import { Model } from 'mongoose';
import { OtpDocument } from './schemas/otp.schema';
export declare class OtpRepository {
    private otpModel;
    constructor(otpModel: Model<OtpDocument>);
    create(createOtpDto: any): Promise<OtpDocument>;
    findByEmailAndPurpose(email: string, purpose: string): Promise<OtpDocument | null>;
    verify(id: string): Promise<OtpDocument | null>;
    incrementAttempts(id: string): Promise<OtpDocument | null>;
    delete(id: string): Promise<OtpDocument | null>;
}
