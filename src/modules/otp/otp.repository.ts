import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';

@Injectable()
export class OtpRepository {
  constructor(@InjectModel(Otp.name) private otpModel: Model<OtpDocument>) {}

  async create(createOtpDto: any): Promise<OtpDocument> {
    const newOtp = new this.otpModel(createOtpDto);
    return newOtp.save();
  }

  async findByEmailAndPurpose(
    email: string,
    purpose: string,
  ): Promise<OtpDocument | null> {
    return this.otpModel
      .findOne({
        email,
        purpose,
        verified: false,
        expiresAt: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async verify(id: string): Promise<OtpDocument | null> {
    return this.otpModel
      .findByIdAndUpdate(id, { verified: true }, { new: true })
      .exec();
  }

  async incrementAttempts(id: string): Promise<OtpDocument | null> {
    return this.otpModel
      .findByIdAndUpdate(id, { $inc: { attempts: 1 } }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<OtpDocument | null> {
    return this.otpModel.findByIdAndDelete(id).exec();
  }
}
