import { RolePermissions } from '../schemas/organization-role.schema';
export declare class CreateOrganizationDto {
    name: string;
    description?: string;
}
export declare class UpdateOrganizationDto {
    name?: string;
    description?: string;
    settings?: any;
}
export declare class SearchUserDto {
    email: string;
}
export declare class AddMemberDto {
    userId: string;
    email: string;
    roleId: string;
    levelId?: string;
    termId?: string;
}
export declare class UpdateMemberRoleDto {
    roleId: string;
    levelId?: string;
    termId?: string;
}
export declare class CreateRoleDto {
    name: string;
    permissions?: RolePermissions;
}
export declare class UpdateRoleDto {
    name?: string;
    permissions?: RolePermissions;
}
export declare class CreateOrganizationCourseDto {
    title: string;
    description: string;
    thumbnailUrl?: string;
    level: string;
    category: string;
    price: number;
    tags?: string[];
    isPublished?: boolean;
    isOrgPrivate?: boolean;
}
export declare class UpdateOrganizationCourseDto {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    level?: string;
    category?: string;
    price?: number;
    tags?: string[];
    isPublished?: boolean;
    isOrgPrivate?: boolean;
}
export declare class AssignTermDto {
    termId: string;
}
export declare class OrganizationCourseFilterDto {
    termId?: string;
    levelId?: string;
    instructor?: string;
    isPublished?: string;
}
