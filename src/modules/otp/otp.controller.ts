import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OtpService } from './otp.service';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'; // OTP might be public for some flows

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  generate(@Body() generateOtpDto: any) {
    // Logic to generate and send OTP
    return this.otpService.create(generateOtpDto);
  }

  @Post('verify')
  verify(@Body() verifyOtpDto: any) {
    // Logic to verify OTP
    // This is a placeholder, actual verification logic will be more complex
    return { status: 'verification logic pending' };
  }
}
