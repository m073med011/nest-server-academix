import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';
import { Organization } from '../../organizations/schemas/organization.schema';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId: Course;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Material',
    required: true,
  })
  materialId: any; // TODO: Replace with Material type when available

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organizationId: Organization;

  @Prop({ required: true, enum: AttendanceStatus })
  status: AttendanceStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recordedBy: User;

  @Prop({ maxlength: 500 })
  notes: string;

  @Prop({ default: Date.now })
  recordedAt: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Indexes
AttendanceSchema.index({ userId: 1, materialId: 1 }, { unique: true });
AttendanceSchema.index({ courseId: 1, createdAt: -1 });
AttendanceSchema.index({ organizationId: 1, materialId: 1 });
AttendanceSchema.index({ userId: 1, courseId: 1 });
