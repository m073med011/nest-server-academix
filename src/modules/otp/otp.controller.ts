import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { GenerateOtpDto, VerifyOtpDto, ResendOtpDto } from './dto/otp.dto';

@ApiTags('OTP')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate and send OTP via email',
    description:
      'Generates a secure 6-digit OTP and sends it to the specified email address via Brevo',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP sent successfully',
    schema: {
      example: {
        success: true,
        message: 'OTP sent to user@example.com',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
  })
  async generate(@Body() generateOtpDto: GenerateOtpDto) {
    return this.otpService.generateOtp(
      generateOtpDto.email,
      generateOtpDto.purpose,
    );
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify OTP code',
    description:
      'Verifies the provided OTP code against the stored OTP for the email and purpose',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP verified successfully',
    schema: {
      example: {
        success: true,
        message: 'OTP verified successfully',
        verified: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid OTP or maximum attempts exceeded',
  })
  @ApiNotFoundResponse({
    description: 'OTP not found or expired',
  })
  async verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.code,
      verifyOtpDto.purpose,
    );
  }

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend OTP code',
    description:
      'Generates a new OTP and sends it to the email address. Previous OTP will be invalidated',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP resent successfully',
    schema: {
      example: {
        success: true,
        message: 'OTP sent to user@example.com',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
  })
  async resend(@Body() resendOtpDto: ResendOtpDto) {
    return this.otpService.generateOtp(
      resendOtpDto.email,
      resendOtpDto.purpose,
    );
  }
}
