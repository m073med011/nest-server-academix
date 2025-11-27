import { UserRole, AuthProvider } from '../../users/schemas/user.schema';
export declare class RegisterDto {
    name: string;
    email: string;
    password?: string;
    role?: UserRole;
    isOAuthUser?: boolean;
    provider?: AuthProvider;
    imageProfileUrl?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class VerifyEmailDto {
    email: string;
    otp: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    otp: string;
    newPassword: string;
}
export declare class RefreshTokenDto {
    refreshToken?: string;
}
export declare class Enable2FAConfirmDto {
    otp: string;
}
export declare class CompleteRegistrationDto {
    role: UserRole;
}
