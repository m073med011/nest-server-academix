import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, trim: true, maxlength: 100 })
  title: string;

  @Prop({ required: true, maxlength: 2000 })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  instructor: User;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  editors: User[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  duration: number;

  @Prop({ type: String, enum: CourseLevel, default: CourseLevel.BEGINNER })
  level: CourseLevel;

  @Prop({ required: true })
  category: string;

  @Prop()
  thumbnailUrl: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  students: User[];

  @Prop({ min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Material' }] })
  materials: any[]; // TODO: Replace with Material type when available

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization' })
  organizationId?: any; // TODO: Replace with Organization type when available

  @Prop({ default: false })
  isOrgPrivate: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Term' })
  termId?: any; // TODO: Replace with Term type when available
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// Indexes
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ instructor: 1, isPublished: 1 });
CourseSchema.index({ organizationId: 1, isOrgPrivate: 1, isPublished: 1 });
CourseSchema.index({ termId: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ level: 1 });
