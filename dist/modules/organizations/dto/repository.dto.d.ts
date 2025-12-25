import { Types } from 'mongoose';
import { MembershipStatus } from '../schemas/organization-membership.schema';
export interface CreateMembershipDto {
    userId: string | Types.ObjectId;
    organizationId: string | Types.ObjectId;
    roleId: string | Types.ObjectId;
    levelId?: string | Types.ObjectId;
    termId?: string | Types.ObjectId;
    status: MembershipStatus;
}
export interface CreateRoleDto {
    name: string;
    organizationId: string | Types.ObjectId;
    permissions: {
        canManageOrganization?: boolean;
        canManageLevels?: boolean;
        canManageTerms?: boolean;
        canManageCourses?: boolean;
        canManageStudents?: boolean;
        canManageRoles?: boolean;
        canRecordAttendance?: boolean;
        canViewReports?: boolean;
    };
    isSystemRole: boolean;
}
