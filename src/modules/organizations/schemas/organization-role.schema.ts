import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrganizationRoleDocument = HydratedDocument<OrganizationRole>;

@Schema({ _id: false })
export class RolePermissions {
  @Prop({ default: false })
  canManageOrganization: boolean;

  @Prop({ default: false })
  canManageLevels: boolean;

  @Prop({ default: false })
  canManageTerms: boolean;

  @Prop({ default: false })
  canManageCourses: boolean;

  @Prop({ default: false })
  canManageStudents: boolean;

  @Prop({ default: false })
  canManageRoles: boolean;

  @Prop({ default: false })
  canRecordAttendance: boolean;

  @Prop({ default: false })
  canViewReports: boolean;
}

@Schema({ timestamps: true })
export class OrganizationRole {
  @Prop({ required: true, trim: true, maxlength: 50 })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: RolePermissions, default: () => ({}) })
  permissions: RolePermissions;

  @Prop({ default: false, immutable: true })
  isSystemRole: boolean;
}

export const OrganizationRoleSchema =
  SchemaFactory.createForClass(OrganizationRole);

OrganizationRoleSchema.index({ organizationId: 1 });
OrganizationRoleSchema.index({ organizationId: 1, name: 1 }, { unique: true });
