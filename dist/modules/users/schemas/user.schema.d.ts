import { HydratedDocument, Types } from 'mongoose';
export interface UserMethods {
    matchPassword(enteredPassword: string): Promise<boolean>;
}
export type UserDocument = HydratedDocument<User, UserMethods>;
export declare enum UserRole {
    STUDENT = "student",
    INSTRUCTOR = "instructor",
    ADMIN = "admin",
    FREELANCER = "freelancer",
    ORGANIZER = "organizer",
    GUEST = "guest"
}
export declare enum AuthProvider {
    CREDENTIALS = "credentials",
    GOOGLE = "google"
}
export declare class User {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    isOAuthUser: boolean;
    provider: AuthProvider;
    purchasedCourses: Types.ObjectId[];
    lastActiveOrganization: Types.ObjectId;
    imageProfileUrl?: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
