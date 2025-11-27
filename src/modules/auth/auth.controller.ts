import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
  Enable2FAConfirmDto,
  CompleteRegistrationDto,
} from './dto/auth.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(registerDto, res);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto, res);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with OTP' })
  @ApiResponse({ status: 200, description: 'Email successfully verified.' })
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.verifyEmail(verifyEmailDto, res);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset OTP' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP' })
  @ApiResponse({ status: 200, description: 'Password successfully reset.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const result = await this.authService.refreshToken(
      refreshTokenDto,
      req,
      res,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  async logout(@Request() req, @Res() res: Response) {
    const result = await this.authService.logout(req, res);
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
  getProfile(@Request() req) {
    return { success: true, user: req.user };
  }

  @Get('user/:email')
  @ApiOperation({ summary: 'Get user by email (OAuth check)' })
  @ApiResponse({ status: 200, description: 'User found.' })
  async getUserByEmail(@Param('email') email: string, @Res() res: Response) {
    const result = await this.authService.getUserByEmail(email, res);
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('enable-2fa')
  @ApiOperation({ summary: 'Enable 2FA' })
  async enable2FA(@Request() req) {
    return this.authService.enable2FA(req.user._id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('confirm-2fa')
  @ApiOperation({ summary: 'Confirm 2FA enablement' })
  async confirm2FA(
    @Request() req,
    @Body() enable2FAConfirmDto: Enable2FAConfirmDto,
  ) {
    return this.authService.confirm2FA(req.user._id, enable2FAConfirmDto.otp);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('disable-2fa')
  @ApiOperation({ summary: 'Disable 2FA' })
  async disable2FA(@Request() req) {
    return this.authService.disable2FA(req.user._id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('complete-registration')
  @ApiOperation({ summary: 'Complete registration (role selection)' })
  async completeRegistration(
    @Request() req,
    @Body() completeRegistrationDto: CompleteRegistrationDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.completeRegistration(
      req.user._id,
      completeRegistrationDto.role,
      res,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth login' })
  async googleAuth(@Request() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
}
