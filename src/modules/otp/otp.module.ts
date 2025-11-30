import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    ConfigModule,
    EmailModule, // Import EmailModule to use BrevoService
  ],
  controllers: [OtpController],
  providers: [OtpService, OtpRepository],
  exports: [OtpService], // Export OtpService for use in AuthModule
})
export class OtpModule {}
