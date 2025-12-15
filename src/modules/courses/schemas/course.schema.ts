import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export type CourseDocument = Course & Document;

export enum EnrollmentType {
  FREE = 'free',
  SUBSCRIPTION = 'subscription',
  ONE_TIME_PURCHASE = 'one-time-purchase',
  ORG_SUBSCRIPTION = 'org-subscription',
}

export enum CourseType {
  FREELANCING = 'freelancing',
  ORGANIZATION = 'organization',
}

export enum ModuleItemType {
  LESSON = 'lesson',
  QUIZ = 'quiz',
  FILE = 'file',
  IMAGE = 'image',
  RESOURCE = 'resource',
  ASSIGNMENT = 'assignment',
}

export enum LessonType {
  TEXT = 'text',
  VIDEO = 'video',
}

@Schema()
export class ModuleItem {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Material',
    required: true,
  })
  materialId: any; // Reference to Material document

  @Prop({ default: 0 })
  order: number;
}

export const ModuleItemSchema = SchemaFactory.createForClass(ModuleItem);

@Schema()
export class Module {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [ModuleItemSchema], default: [] })
  items: ModuleItem[];
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

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

  @Prop({ type: [ModuleSchema], default: [] })
  modules: Module[];

  @Prop({
    type: String,
    enum: EnrollmentType,
    default: EnrollmentType.FREE,
  })
  enrollmentType: EnrollmentType;

  @Prop({ type: String, enum: CourseType, default: CourseType.FREELANCING })
  courseType: CourseType;

  @Prop({ default: false })
  hasAccessRestrictions: boolean;

  @Prop({ type: Number, default: null })
  enrollmentCap: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization' })
  organizationId?: any; // TODO: Replace with Organization type when available

  @Prop({ default: false })
  isOrgPrivate: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Term' })
  termId?: any; // TODO: Replace with Term type when available

  @Prop({ default: 'USD' })
  currency: string;

  @Prop()
  promoVideoUrl?: string;

  @Prop({ default: '#137fec' })
  brandColor: string;

  @Prop({ type: Date })
  enrollmentStartDate?: Date;

  @Prop({ type: Date })
  enrollmentEndDate?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// Indexes
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ instructor: 1, isPublished: 1 });
CourseSchema.index({ organizationId: 1, isOrgPrivate: 1, isPublished: 1 });
CourseSchema.index({ termId: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ level: 1 });
