import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OtpService } from '../otp/otp.service';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from './dto/auth.dto';
import { Response } from 'express';
import * as crypto from 'crypto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && (await user.matchPassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  private setAuthCookies(res: Response, userId: string) {
    const accessToken = this.jwtService.sign({ sub: userId });
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d' },
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('app.security.cookieSecure'),
      sameSite: this.configService.get('app.security.cookieSameSite'),
      path: '/',
      domain: this.configService.get('app.security.cookieDomain'),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false, // Readable by JS
      secure: this.configService.get('app.security.cookieSecure'),
      sameSite: this.configService.get('app.security.cookieSameSite'),
      path: '/',
      domain: this.configService.get('app.security.cookieDomain'),
    });

    return { accessToken, refreshToken, csrfToken };
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Generate OTP for email verification
      await this.otpService.generateOtp(
        user.email,
        'email_verification' as any,
      );

      return {
        success: true,
        requiresEmailVerification: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Please verify your email.',
      };
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Generate OTP for 2FA
      await this.otpService.generateOtp(user.email, 'two_factor' as any);

      return {
        success: true,
        requires2FA: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: '2FA verification required.',
      };
    }

    const { accessToken, refreshToken } = this.setAuthCookies(
      res,
      user._id.toString(),
    );

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

  async register(registerDto: RegisterDto, res: Response) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      // If it's an OAuth login attempt but user exists
      if (registerDto.isOAuthUser) {
        // Check 2FA for existing user logging in via OAuth
        if (existingUser.twoFactorEnabled) {
          await this.otpService.generateOtp(
            existingUser.email,
            'two_factor' as any,
          );
          return {
            success: true,
            requires2FA: true,
            user: {
              id: existingUser._id,
              name: existingUser.name,
              email: existingUser.email,
              role: existingUser.role,
            },
            message: '2FA verification required.',
          };
        }

        // Login the user
        const { accessToken, refreshToken } = this.setAuthCookies(
          res,
          existingUser._id.toString(),
        );
        return {
          success: true,
          token: accessToken,
          refreshToken,
          message: 'Logged in successfully',
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            imageProfileUrl: existingUser.imageProfileUrl,
            emailVerified: existingUser.emailVerified,
            twoFactorEnabled: existingUser.twoFactorEnabled,
          },
        };
      }
      throw new BadRequestException('User already exists');
    }

    if (registerDto.isOAuthUser && !registerDto.role) {
      registerDto.role = UserRole.GUEST;
    }

    const user = await this.usersService.create(registerDto);

    // If OAuth user, we still want to verify email (OTP) to enforce the flow
    // So we fall through to the OTP generation below

    // Generate OTP for email verification
    await this.otpService.generateOtp(user.email, 'email_verification' as any);

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

  async verifyEmail(verifyEmailDto: VerifyEmailDto, res: Response) {
    // Verify OTP
    const isValid = await this.otpService.verifyOtp(
      verifyEmailDto.email,
      verifyEmailDto.otp,
      'email_verification' as any,
    );
    if (!isValid.verified) throw new BadRequestException('Invalid OTP');

    const user = await this.usersService.findByEmail(verifyEmailDto.email);
    if (!user) throw new NotFoundException('User not found');

    await this.usersService.update(user._id.toString(), {
      emailVerified: true,
    });

    const { accessToken, refreshToken } = this.setAuthCookies(
      res,
      user._id.toString(),
    );

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Email verified successfully',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Don't reveal user existence
      return { success: true, message: 'If email exists, OTP sent' };
    }

    // Generate OTP for password reset
    await this.otpService.generateOtp(user.email, 'password_reset' as any);

    return { success: true, message: 'If email exists, OTP sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Verify OTP
    const isValid = await this.otpService.verifyOtp(
      resetPasswordDto.email,
      resetPasswordDto.otp,
      'password_reset' as any,
    );
    if (!isValid.verified) throw new BadRequestException('Invalid OTP');

    const user = await this.usersService.findByEmail(resetPasswordDto.email);
    if (!user) throw new NotFoundException('User not found');

    await this.usersService.updatePassword(
      user._id.toString(),
      resetPasswordDto.newPassword,
    );

    return { success: true, message: 'Password reset successfully' };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
    req: any,
    res: Response,
  ) {
    let token = refreshTokenDto.refreshToken;
    if (!token && req.cookies && req.cookies.refresh_token) {
      token = req.cookies.refresh_token;
    }

    if (!token) throw new UnauthorizedException('Refresh token required');

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      const { accessToken } = this.setAuthCookies(res, user._id.toString());

      return {
        success: true,
        data: { accessToken },
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(req: any, res: Response) {
    res.clearCookie('refresh_token');
    res.clearCookie('XSRF-TOKEN');
    return { success: true, message: 'Logged out successfully' };
  }

  async getUserByEmail(email: string, res: Response) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { success: false, message: 'User not found' };

    if (!user.isOAuthUser) {
      throw new BadRequestException(
        'This account uses email/password authentication.',
      );
    }

    const { accessToken, refreshToken } = this.setAuthCookies(
      res,
      user._id.toString(),
    );

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

  async enable2FA(userId: string) {
    // Placeholder
    return {
      success: true,
      message: '2FA enable initiated',
      requiresVerification: true,
    };
  }

  async confirm2FA(userId: string, otp: string) {
    // Placeholder
    return { success: true, message: '2FA enabled' };
  }

  async disable2FA(userId: string) {
    // Placeholder
    return { success: true, message: '2FA disabled' };
  }

  async completeRegistration(userId: string, role: UserRole, res: Response) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.role !== UserRole.GUEST) {
      throw new BadRequestException('User already registered');
    }

    const updatedUser = await this.usersService.update(userId, { role });
    const { accessToken, refreshToken } = this.setAuthCookies(
      res,
      updatedUser._id.toString(),
    );

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

  async validateOAuthUser(details: any) {
    const { email, name, picture, provider } = details;
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        email,
        name,
        imageProfileUrl: picture,
        provider,
        isOAuthUser: true,
        role: UserRole.GUEST,
        emailVerified: true,
        password: '', // Dummy password for OAuth users
      });
    }

    return user;
  }

  async googleLogin(req: any) {
    if (!req.user) {
      return { success: false, message: 'No user from google' };
    }
    return {
      success: true,
      message: 'User information from google',
      user: req.user,
    };
  }
}
