import { Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) {}

  create(createOtpDto: any) {
    return this.otpRepository.create(createOtpDto);
  }

  findByEmailAndPurpose(email: string, purpose: string) {
    return this.otpRepository.findByEmailAndPurpose(email, purpose);
  }

  verify(id: string) {
    return this.otpRepository.verify(id);
  }

  incrementAttempts(id: string) {
    return this.otpRepository.incrementAttempts(id);
  }

  remove(id: string) {
    return this.otpRepository.delete(id);
  }
}
