import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';

export enum PaymentMethod {
  CARD = 'card',
  WALLET = 'wallet',
  CASH = 'cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export type PaymentDocument = Payment & Document;

@Schema()
export class BillingData {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: false })
  apartment?: string;

  @Prop({ required: false })
  floor?: string;

  @Prop({ required: false })
  street?: string;

  @Prop({ required: false })
  building?: string;

  @Prop({ required: false })
  shippingMethod?: string;

  @Prop({ required: false })
  postalCode?: string;

  @Prop({ required: false })
  city?: string;

  @Prop({ required: false })
  country?: string;

  @Prop({ required: false })
  state?: string;
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId?: Course;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }] })
  courseIds: Course[];

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ min: 0 })
  originalAmount: number;

  @Prop({ default: 0, min: 0 })
  discountAmount: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'DiscountCode' })
  discountCodeId?: any; // TODO: Replace with DiscountCode type when available

  @Prop({ default: false })
  isCartPayment: boolean;

  @Prop({ required: true, default: 'EGP' })
  currency: string;

  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop()
  paymobOrderId: string;

  @Prop()
  paymobTransactionId: string;

  @Prop()
  paymobPaymentId: string;

  @Prop({ type: BillingData })
  billingData: BillingData;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Indexes
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ courseId: 1 });
PaymentSchema.index({ courseIds: 1 });
PaymentSchema.index({ paymobOrderId: 1 });
PaymentSchema.index({ paymobTransactionId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ discountCodeId: 1 });
PaymentSchema.index({ isCartPayment: 1 });
PaymentSchema.index({ userId: 1, isCartPayment: 1 });
