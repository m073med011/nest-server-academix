import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema';

export enum MaterialType {
  VIDEO = 'video',
  PDF = 'pdf',
  LINK = 'link',
  TEXT = 'text',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
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

  @Prop()
  content: string; // For text/article content, quiz questions JSON, etc.

  @Prop()
  url: string; // For video URL or external link

  @Prop({ default: 0 })
  order: number;

  @Prop()
  duration: number; // Video duration or read time in minutes

  @Prop({ default: false })
  isPublished: boolean;

  // Video-specific fields
  @Prop({ default: false })
  isFreePreview: boolean;

  @Prop({ default: false })
  allowDownloads: boolean;

  // Assignment-specific fields
  @Prop({ type: Number, min: 0 })
  points: number;

  @Prop({ type: Date })
  dueDate: Date;

  @Prop({ type: [String], default: [] })
  submissionTypes: string[];

  @Prop({ default: false })
  allowLate: boolean;

  // Link-specific fields
  @Prop({ default: true })
  openInNewTab: boolean;

  // Module reference for grouping
  @Prop()
  moduleId: string; // To group materials by module within course
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

// Indexes
MaterialSchema.index({ courseId: 1, order: 1 });
MaterialSchema.index({ courseId: 1, moduleId: 1, order: 1 });
