import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto, Enable2FAConfirmDto, CompleteRegistrationDto } from './dto/auth.dto';
import { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(loginDto: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyEmail(verifyEmailDto: VerifyEmailDto, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: any): {
        success: boolean;
        user: any;
    };
    getUserByEmail(email: string, res: Response): Promise<Response<any, Record<string, any>>>;
    enable2FA(req: any): Promise<{
        success: boolean;
        message: string;
        requiresVerification: boolean;
    }>;
    confirm2FA(req: any, enable2FAConfirmDto: Enable2FAConfirmDto): Promise<{
        success: boolean;
        message: string;
    }>;
    disable2FA(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    completeRegistration(req: any, completeRegistrationDto: CompleteRegistrationDto, res: Response): Promise<Response<any, Record<string, any>>>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        message: string;
        user: any;
    }>;
}
