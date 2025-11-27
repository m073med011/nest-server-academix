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
    const user = await this.usersService.findByEmail(email);
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
      secure: this.configService.get('security.cookieSecure'),
      sameSite: this.configService.get('security.cookieSameSite'),
      path: '/',
      domain: this.configService.get('security.cookieDomain'),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false, // Readable by JS
      secure: this.configService.get('security.cookieSecure'),
      sameSite: this.configService.get('security.cookieSameSite'),
      path: '/',
      domain: this.configService.get('security.cookieDomain'),
    });

    return { accessToken, refreshToken, csrfToken };
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
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
      throw new BadRequestException('User already exists');
    }

    const user = await this.usersService.create(registerDto);

    // If OAuth user, login immediately
    if (registerDto.isOAuthUser) {
      const { accessToken, refreshToken } = this.setAuthCookies(
        res,
        user._id.toString(),
      );
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

    // Generate OTP for email verification
    // const otp = await this.otpService.generate(user.email, 'email_verification');
    // await this.emailService.sendVerificationEmail(user.email, otp.code);

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
    // const isValid = await this.otpService.verify(verifyEmailDto.email, verifyEmailDto.otp, 'email_verification');
    // if (!isValid) throw new BadRequestException('Invalid OTP');

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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Don't reveal user existence
      return { success: true, message: 'If email exists, OTP sent' };
    }

    // const otp = await this.otpService.generate(user.email, 'password_reset');
    // await this.emailService.sendPasswordResetEmail(user.email, otp.code);

    return { success: true, message: 'If email exists, OTP sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // const isValid = await this.otpService.verify(resetPasswordDto.email, resetPasswordDto.otp, 'password_reset');
    // if (!isValid) throw new BadRequestException('Invalid OTP');

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
        role: UserRole.STUDENT,
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
