import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';

export enum ChatType {
  PRIVATE = 'private',
  COURSE = 'course',
  SYSTEM = 'system',
}

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true, enum: ChatType })
  type: ChatType;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  participants: User[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: Course;

  @Prop()
  name: string;

  @Prop()
  lastMessage: string;

  @Prop()
  lastMessageTime: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

// Indexes
ChatSchema.index({ participants: 1 });
ChatSchema.index({ courseId: 1 });
