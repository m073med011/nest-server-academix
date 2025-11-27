import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';

export type CartDocument = Cart & Document;

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: String, ref: 'Course', required: true })
  courseId: string;

  @Prop({ default: Date.now })
  addedAt: Date;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true, collection: 'carts' })
export class Cart {
  @Prop({
    type: String,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Indexes
CartSchema.index({ userId: 1 });
CartSchema.index({ 'items.courseId': 1 });
CartSchema.index({ createdAt: 1 });

// Virtuals
CartSchema.virtual('itemsWithCourses', {
  ref: 'Course',
  localField: 'items.courseId',
  foreignField: '_id',
});

CartSchema.set('toJSON', { virtuals: true });
CartSchema.set('toObject', { virtuals: true });
