import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type OrganizationMembershipDocument =
  HydratedDocument<OrganizationMembership>;

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LEFT = 'left',
}

@Schema({ timestamps: true })
export class OrganizationMembership {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organizationId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'OrganizationRole',
    required: true,
  })
  roleId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Level' })
  levelId?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Term' })
  termId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: MembershipStatus,
    default: MembershipStatus.ACTIVE,
  })
  status: MembershipStatus;

  @Prop({ default: Date.now })
  joinedAt: Date;

  @Prop()
  leftAt?: Date;
}

export const OrganizationMembershipSchema = SchemaFactory.createForClass(
  OrganizationMembership,
);

OrganizationMembershipSchema.index({ userId: 1, organizationId: 1 });
OrganizationMembershipSchema.index({ organizationId: 1, status: 1 });
OrganizationMembershipSchema.index({ levelId: 1, status: 1 });
OrganizationMembershipSchema.index({ termId: 1 });

OrganizationMembershipSchema.index(
  { userId: 1, organizationId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: MembershipStatus.ACTIVE },
  },
);
