import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema';

export enum MaterialType {
  VIDEO = 'video',
  PDF = 'pdf',
  LINK = 'link',
  TEXT = 'text',
}

export type MaterialDocument = Material & Document;

@Schema({ timestamps: true })
export class Material {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId: Course;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: MaterialType })
  type: MaterialType;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  order: number;

  @Prop()
  duration: number;

  @Prop({ default: false })
  isPublished: boolean;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

// Indexes
MaterialSchema.index({ courseId: 1, order: 1 });
