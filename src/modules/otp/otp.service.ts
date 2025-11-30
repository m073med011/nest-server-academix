import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { OtpRepository } from './otp.repository';
import { BrevoService } from '../email/brevo.service';
import { OtpPurpose } from './schemas/otp.schema';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly brevoService: BrevoService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate and send OTP via email
   * @param email - User's email address
   * @param purpose - Purpose of the OTP (email verification, password reset, etc.)
   * @returns Success message
   */
  async generateOtp(
    email: string,
    purpose: OtpPurpose,
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`Generating OTP for ${email} - Purpose: ${purpose}`);

      // Generate secure 6-digit OTP
      const code = this.generateSecureOtpCode();

      // Calculate expiration time
      const expirationMinutes =
        this.configService.get<number>('app.otp.expirationMinutes') || 10;
      const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

      // Delete any existing OTPs for this email and purpose
      const existingOtp = await this.otpRepository.findByEmailAndPurpose(
        email.toLowerCase(),
        purpose,
      );

      if (existingOtp) {
        await this.otpRepository.delete(existingOtp._id.toString());
        this.logger.log(`Deleted existing OTP for ${email}`);
      }

      // Create new OTP
      await this.otpRepository.create({
        code,
        email: email.toLowerCase(),
        purpose,
        expiresAt,
        verified: false,
        attempts: 0,
      });

      // Send OTP via Brevo email service
      await this.brevoService.sendOtpEmail(email, code, purpose as any);

      this.logger.log(`OTP sent successfully to ${email}`);

      return {
        success: true,
        message: `OTP sent to ${email}`,
      };
    } catch (error) {
      this.logger.error(`Failed to generate OTP: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Verify OTP code
   * @param email - User's email address
   * @param code - 6-digit OTP code
   * @param purpose - Purpose of the OTP
   * @returns Verification result
   */
  async verifyOtp(
    email: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<{ success: boolean; message: string; verified: boolean }> {
    try {
      this.logger.log(`Verifying OTP for ${email} - Purpose: ${purpose}`);

      // Find the OTP
      const otp = await this.otpRepository.findByEmailAndPurpose(
        email.toLowerCase(),
        purpose,
      );

      if (!otp) {
        this.logger.warn(`OTP not found for ${email}`);
        throw new NotFoundException('Invalid or expired OTP');
      }

      // Check if OTP is already verified
      if (otp.verified) {
        this.logger.warn(`OTP already used for ${email}`);
        throw new BadRequestException('OTP has already been used');
      }

      // Check maximum attempts
      const maxAttempts =
        this.configService.get<number>('app.otp.maxAttempts') || 5;
      if (otp.attempts >= maxAttempts) {
        this.logger.warn(
          `Maximum attempts exceeded for ${email} - Attempts: ${otp.attempts}`,
        );
        throw new BadRequestException(
          'Maximum verification attempts exceeded. Please request a new OTP',
        );
      }

      // Check if OTP is expired
      if (new Date() > otp.expiresAt) {
        this.logger.warn(`OTP expired for ${email}`);
        throw new BadRequestException(
          'OTP has expired. Please request a new one',
        );
      }

      // Verify the code
      if (otp.code !== code) {
        await this.otpRepository.incrementAttempts(otp._id.toString());
        const remainingAttempts = (maxAttempts || 5) - (otp.attempts + 1);

        this.logger.warn(
          `Invalid OTP code for ${email} - Remaining attempts: ${remainingAttempts}`,
        );

        if (remainingAttempts <= 0) {
          throw new BadRequestException(
            'Invalid OTP. Maximum attempts exceeded. Please request a new OTP',
          );
        }

        throw new BadRequestException(
          `Invalid OTP. ${remainingAttempts} attempts remaining`,
        );
      }

      // Mark OTP as verified
      await this.otpRepository.verify(otp._id.toString());

      this.logger.log(`OTP verified successfully for ${email}`);

      return {
        success: true,
        message: 'OTP verified successfully',
        verified: true,
      };
    } catch (error) {
      this.logger.error(`Failed to verify OTP: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate cryptographically secure 6-digit OTP
   * @returns 6-digit OTP code as string
   */
  private generateSecureOtpCode(): string {
    const min = 100000;
    const max = 999999;
    const randomNumber = crypto.randomInt(min, max + 1);
    return randomNumber.toString();
  }

  /**
   * Delete OTP by ID
   * @param id - OTP document ID
   */
  async remove(id: string): Promise<void> {
    await this.otpRepository.delete(id);
  }

  /**
   * Find OTP by email and purpose
   * @param email - User's email address
   * @param purpose - Purpose of the OTP
   */
  async findByEmailAndPurpose(email: string, purpose: string) {
    return this.otpRepository.findByEmailAndPurpose(email, purpose);
  }
}
