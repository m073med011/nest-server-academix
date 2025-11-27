"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const otp_service_1 = require("../otp/otp.service");
const crypto = require("crypto");
const user_schema_1 = require("../users/schemas/user.schema");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    otpService;
    constructor(usersService, jwtService, configService, otpService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.otpService = otpService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await user.matchPassword(pass))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    setAuthCookies(res, userId) {
        const accessToken = this.jwtService.sign({ sub: userId });
        const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: this.configService.get('security.cookieSecure'),
            sameSite: this.configService.get('security.cookieSameSite'),
            path: '/',
            domain: this.configService.get('security.cookieDomain'),
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const csrfToken = crypto.randomBytes(32).toString('hex');
        res.cookie('XSRF-TOKEN', csrfToken, {
            httpOnly: false,
            secure: this.configService.get('security.cookieSecure'),
            sameSite: this.configService.get('security.cookieSameSite'),
            path: '/',
            domain: this.configService.get('security.cookieDomain'),
        });
        return { accessToken, refreshToken, csrfToken };
    }
    async login(loginDto, res) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const { accessToken, refreshToken } = this.setAuthCookies(res, user._id.toString());
        return {
            success: true,
            token: accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                imageProfileUrl: user.imageProfileUrl,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactorEnabled,
            },
        };
    }
    async register(registerDto, res) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const user = await this.usersService.create(registerDto);
        if (registerDto.isOAuthUser) {
            const { accessToken, refreshToken } = this.setAuthCookies(res, user._id.toString());
            return {
                success: true,
                token: accessToken,
                refreshToken,
                message: 'Account created successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    imageProfileUrl: user.imageProfileUrl,
                    emailVerified: user.emailVerified,
                    twoFactorEnabled: user.twoFactorEnabled,
                },
            };
        }
        return {
            success: true,
            requiresEmailVerification: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: 'Registration successful. Please verify your email.',
        };
    }
    async verifyEmail(verifyEmailDto, res) {
        const user = await this.usersService.findByEmail(verifyEmailDto.email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.usersService.update(user._id.toString(), {
            emailVerified: true,
        });
        const { accessToken, refreshToken } = this.setAuthCookies(res, user._id.toString());
        return {
            success: true,
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: 'Email verified successfully',
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            return { success: true, message: 'If email exists, OTP sent' };
        }
        return { success: true, message: 'If email exists, OTP sent' };
    }
    async resetPassword(resetPasswordDto) {
        const user = await this.usersService.findByEmail(resetPasswordDto.email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.usersService.updatePassword(user._id.toString(), resetPasswordDto.newPassword);
        return { success: true, message: 'Password reset successfully' };
    }
    async refreshToken(refreshTokenDto, req, res) {
        let token = refreshTokenDto.refreshToken;
        if (!token && req.cookies && req.cookies.refresh_token) {
            token = req.cookies.refresh_token;
        }
        if (!token)
            throw new common_1.UnauthorizedException('Refresh token required');
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findById(payload.sub);
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            const { accessToken } = this.setAuthCookies(res, user._id.toString());
            return {
                success: true,
                data: { accessToken },
            };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(req, res) {
        res.clearCookie('refresh_token');
        res.clearCookie('XSRF-TOKEN');
        return { success: true, message: 'Logged out successfully' };
    }
    async getUserByEmail(email, res) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return { success: false, message: 'User not found' };
        if (!user.isOAuthUser) {
            throw new common_1.BadRequestException('This account uses email/password authentication.');
        }
        const { accessToken, refreshToken } = this.setAuthCookies(res, user._id.toString());
        return {
            success: true,
            token: accessToken,
            refreshToken,
            message: 'Successfully verified Google account',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                imageProfileUrl: user.imageProfileUrl,
            },
        };
    }
    async enable2FA(userId) {
        return {
            success: true,
            message: '2FA enable initiated',
            requiresVerification: true,
        };
    }
    async confirm2FA(userId, otp) {
        return { success: true, message: '2FA enabled' };
    }
    async disable2FA(userId) {
        return { success: true, message: '2FA disabled' };
    }
    async completeRegistration(userId, role, res) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== user_schema_1.UserRole.GUEST) {
            throw new common_1.BadRequestException('User already registered');
        }
        const updatedUser = await this.usersService.update(userId, { role });
        const { accessToken, refreshToken } = this.setAuthCookies(res, updatedUser._id.toString());
        return {
            success: true,
            token: accessToken,
            refreshToken,
            message: 'Registration completed successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        };
    }
    async validateOAuthUser(details) {
        const { email, name, picture, provider } = details;
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            user = await this.usersService.create({
                email,
                name,
                imageProfileUrl: picture,
                provider,
                isOAuthUser: true,
                role: user_schema_1.UserRole.STUDENT,
                emailVerified: true,
                password: '',
            });
        }
        return user;
    }
    async googleLogin(req) {
        if (!req.user) {
            return { success: false, message: 'No user from google' };
        }
        return {
            success: true,
            message: 'User information from google',
            user: req.user,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        otp_service_1.OtpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map