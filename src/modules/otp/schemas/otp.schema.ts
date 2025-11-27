import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum OtpPurpose {
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification',
  LOGIN_VERIFICATION = 'login_verification',
}

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, length: 6, match: /^\d{6}$/ })
  code: string;

  @Prop({
    required: true,
    lowercase: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;

  @Prop({ required: true, enum: OtpPurpose })
  purpose: string;

  @Prop({ required: true, index: { expireAfterSeconds: 0 } })
  expiresAt: Date;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: 0, max: 5 })
  attempts: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Indexes
OtpSchema.index({ email: 1, purpose: 1, expiresAt: 1 });
OtpSchema.index({ email: 1, purpose: 1, verified: 1 });

// Ensure only one active OTP per email per purpose
OtpSchema.index(
  { email: 1, purpose: 1 },
  {
    partialFilterExpression: {
      verified: false,
      expiresAt: { $gt: new Date() },
    },
    unique: true,
  },
);
