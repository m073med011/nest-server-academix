import { IsEmail, IsNotEmpty, IsString, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from '../schemas/otp.schema';

export class GenerateOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to send OTP to',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: OtpPurpose.EMAIL_VERIFICATION,
    enum: OtpPurpose,
    description: 'Purpose of the OTP',
  })
  @IsNotEmpty()
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address associated with OTP',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP code',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
  code: string;

  @ApiProperty({
    example: OtpPurpose.EMAIL_VERIFICATION,
    enum: OtpPurpose,
    description: 'Purpose of the OTP',
  })
  @IsNotEmpty()
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

export class ResendOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to resend OTP to',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: OtpPurpose.EMAIL_VERIFICATION,
    enum: OtpPurpose,
    description: 'Purpose of the OTP',
  })
  @IsNotEmpty()
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}
