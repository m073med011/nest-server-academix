import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { Otp, OtpSchema } from './schemas/otp.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  controllers: [OtpController],
  providers: [OtpService, OtpRepository],
  exports: [OtpService],
})
export class OtpModule {}
