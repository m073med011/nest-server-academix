import { HydratedDocument, Types } from 'mongoose';
export type OrganizationRoleDocument = HydratedDocument<OrganizationRole>;
export declare class RolePermissions {
    canManageOrganization: boolean;
    canManageLevels: boolean;
    canManageTerms: boolean;
    canManageCourses: boolean;
    canManageStudents: boolean;
    canManageRoles: boolean;
    canRecordAttendance: boolean;
    canViewReports: boolean;
}
export declare class OrganizationRole {
    name: string;
    organizationId: Types.ObjectId;
    permissions: RolePermissions;
    isSystemRole: boolean;
}
export declare const OrganizationRoleSchema: import("mongoose").Schema<OrganizationRole, import("mongoose").Model<OrganizationRole, any, any, any, import("mongoose").Document<unknown, any, OrganizationRole, any, {}> & OrganizationRole & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrganizationRole, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<OrganizationRole>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<OrganizationRole> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
