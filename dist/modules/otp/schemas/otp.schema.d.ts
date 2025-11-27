import { Document } from 'mongoose';
export declare enum OtpPurpose {
    PASSWORD_RESET = "password_reset",
    EMAIL_VERIFICATION = "email_verification",
    LOGIN_VERIFICATION = "login_verification"
}
export type OtpDocument = Otp & Document;
export declare class Otp {
    code: string;
    email: string;
    purpose: string;
    expiresAt: Date;
    verified: boolean;
    attempts: number;
}
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, Document<unknown, any, Otp, any, {}> & Otp & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, Document<unknown, {}, import("mongoose").FlatRecord<Otp>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Otp> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
