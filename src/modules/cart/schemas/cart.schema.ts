import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';

export type CartDocument = Cart & Document;

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId: string;

  @Prop({ default: Date.now })
  addedDate: Date;
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

// Virtual for item count
CartSchema.virtual('itemCount').get(function() {
  return this.items ? this.items.length : 0;
});

// Virtual for total price (calculated from populated course prices)
CartSchema.virtual('totalPrice').get(function() {
  if (!this.items || this.items.length === 0) return 0;

  return this.items.reduce((sum, item) => {
    // Check if courseId is populated with course data
    const course = item.courseId as any;
    if (course && typeof course === 'object' && course.price) {
      return sum + course.price;
    }
    return sum;
  }, 0);
});

CartSchema.set('toJSON', { virtuals: true });
CartSchema.set('toObject', { virtuals: true });
