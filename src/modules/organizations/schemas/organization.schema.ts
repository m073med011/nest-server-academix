import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type OrganizationDocument = Organization & Document;

@Schema()
export class OrganizationSettings {
  @Prop({ default: true })
  allowMultipleLevels: boolean;

  @Prop({ default: false })
  requireTermAssignment: boolean;

  @Prop({ default: false })
  allowStudentSelfEnroll: boolean;
}

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ maxlength: 1000 })
  description: string;

  @Prop()
  orgcover: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  })
  owner: User;

  @Prop({ type: OrganizationSettings, default: () => ({}) })
  settings: OrganizationSettings;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Level' }] })
  levels: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Term' }] })
  terms: MongooseSchema.Types.ObjectId[];

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  deletedBy?: User | null;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

// Indexes
OrganizationSchema.index({ owner: 1 });
OrganizationSchema.index({ name: 1 });
OrganizationSchema.index({ deletedAt: 1 });

// Virtuals
OrganizationSchema.virtual('members', {
  ref: 'OrganizationMembership',
  localField: '_id',
  foreignField: 'organizationId',
});
