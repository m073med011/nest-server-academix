import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OtpService } from '../otp/otp.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto } from './dto/auth.dto';
import { Response } from 'express';
import { UserRole } from '../users/schemas/user.schema';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private otpService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, otpService: OtpService);
    validateUser(email: string, pass: string): Promise<any>;
    private setAuthCookies;
    login(loginDto: LoginDto, res: Response): Promise<{
        success: boolean;
        token: string;
        refreshToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            imageProfileUrl: any;
            emailVerified: any;
            twoFactorEnabled: any;
        };
    }>;
    register(registerDto: RegisterDto, res: Response): Promise<{
        success: boolean;
        token: string;
        refreshToken: string;
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: UserRole;
            imageProfileUrl: string | undefined;
            emailVerified: boolean;
            twoFactorEnabled: boolean;
        };
        requiresEmailVerification?: undefined;
    } | {
        success: boolean;
        requiresEmailVerification: boolean;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: UserRole;
            imageProfileUrl?: undefined;
            emailVerified?: undefined;
            twoFactorEnabled?: undefined;
        };
        message: string;
        token?: undefined;
        refreshToken?: undefined;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto, res: Response): Promise<{
        success: boolean;
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: UserRole;
        };
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto, req: any, res: Response): Promise<{
        success: boolean;
        data: {
            accessToken: string;
        };
    }>;
    logout(req: any, res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserByEmail(email: string, res: Response): Promise<{
        success: boolean;
        message: string;
        token?: undefined;
        refreshToken?: undefined;
        user?: undefined;
    } | {
        success: boolean;
        token: string;
        refreshToken: string;
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: UserRole;
            imageProfileUrl: string | undefined;
        };
    }>;
    enable2FA(userId: string): Promise<{
        success: boolean;
        message: string;
        requiresVerification: boolean;
    }>;
    confirm2FA(userId: string, otp: string): Promise<{
        success: boolean;
        message: string;
    }>;
    disable2FA(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    completeRegistration(userId: string, role: UserRole, res: Response): Promise<{
        success: boolean;
        token: string;
        refreshToken: string;
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: UserRole;
        };
    }>;
    validateOAuthUser(details: any): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, {}> & import("../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    googleLogin(req: any): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        message: string;
        user: any;
    }>;
}
