import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';

export enum DiscountType {
  PLATFORM_WIDE = 'platform_wide',
  COURSE_SPECIFIC = 'course_specific',
}

export enum DiscountValueType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum ApplicableOn {
  SINGLE_ONLY = 'single_only',
  BOTH = 'both',
}

export type DiscountDocument = Discount & Document;

@Schema({ timestamps: true, collection: 'discountcodes' })
export class Discount {
  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  })
  code: string;

  @Prop({ required: true, enum: DiscountType, index: true })
  type: DiscountType;

  @Prop({ type: String, ref: 'User', required: true, index: true })
  createdBy: string;

  @Prop({ type: String, ref: 'Course', index: true })
  courseId?: string;

  @Prop({ required: true, min: 0 })
  value: number;

  @Prop({ required: true, enum: DiscountValueType })
  valueType: DiscountValueType;

  @Prop({ required: true, enum: ApplicableOn })
  applicableOn: ApplicableOn;

  @Prop({ min: 1 })
  maxUses: number;

  @Prop({ default: 0, min: 0 })
  usedCount: number;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop()
  expiresAt: Date;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);

// Indexes
DiscountSchema.index({ type: 1, isActive: 1 });
DiscountSchema.index({ courseId: 1, isActive: 1 });
DiscountSchema.index({ code: 1, isActive: 1 });
DiscountSchema.index({ createdBy: 1, type: 1 });
DiscountSchema.index({ expiresAt: 1 });

// Middleware
DiscountSchema.pre('save', function (next) {
  if (this.type === DiscountType.COURSE_SPECIFIC) {
    this.applicableOn = ApplicableOn.SINGLE_ONLY;
  }
  if (this.type === DiscountType.PLATFORM_WIDE && !this.applicableOn) {
    this.applicableOn = ApplicableOn.BOTH;
  }
  next();
});

DiscountSchema.pre('save', function (next) {
  if (this.type === DiscountType.COURSE_SPECIFIC && !this.courseId) {
    next(new Error('courseId is required for COURSE_SPECIFIC discount codes'));
  } else if (this.type === DiscountType.PLATFORM_WIDE && this.courseId) {
    this.courseId = undefined;
  }
  next();
});
