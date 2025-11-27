import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';
import { Payment } from '../../payments/schemas/payment.schema';

export enum InvoiceStatus {
  ISSUED = 'issued',
  PAID = 'paid',
  VOID = 'void',
  CANCELLED = 'cancelled',
}

export type InvoiceDocument = Invoice & Document;

@Schema({ _id: false })
export class InvoiceItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId: Course;

  @Prop({ required: true })
  courseName: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 1 })
  quantity: number;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

@Schema({ _id: false })
export class BillingData {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  country: string;
}

export const BillingDataSchema = SchemaFactory.createForClass(BillingData);

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true, unique: true })
  invoiceNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Payment', required: true })
  paymentId: Payment;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }] })
  courseIds: Course[];

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'EGP' })
  currency: string;

  @Prop({ required: true, enum: ['card'] })
  paymentMethod: string;

  @Prop({ type: BillingDataSchema, required: true })
  billingData: BillingData;

  @Prop({ type: [InvoiceItemSchema], required: true })
  items: InvoiceItem[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  discountAmount: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true, enum: InvoiceStatus, default: InvoiceStatus.ISSUED })
  status: InvoiceStatus;

  @Prop({ required: true, default: Date.now })
  issuedAt: Date;

  @Prop()
  dueAt: Date;

  @Prop()
  paidAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Indexes
InvoiceSchema.index({ userId: 1, createdAt: -1 });
InvoiceSchema.index({ paymentId: 1 });
InvoiceSchema.index({ invoiceNumber: 1 });
