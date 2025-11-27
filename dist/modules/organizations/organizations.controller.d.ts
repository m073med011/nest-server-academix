import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto, SearchUserDto, AddMemberDto, UpdateMemberRoleDto, CreateRoleDto, UpdateRoleDto, CreateOrganizationCourseDto, UpdateOrganizationCourseDto, AssignTermDto, OrganizationCourseFilterDto } from './dto/organizations.dto';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    create(createOrganizationDto: CreateOrganizationDto, req: any): Promise<import("./schemas/organization.schema").OrganizationDocument>;
    findAll(): Promise<import("./schemas/organization.schema").OrganizationDocument[]>;
    findOne(id: string): Promise<import("./schemas/organization.schema").OrganizationDocument>;
    update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<import("./schemas/organization.schema").OrganizationDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
    searchUser(searchUserDto: SearchUserDto): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, {}> & import("../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    addMember(id: string, addMemberDto: AddMemberDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("./schemas/organization-membership.schema").OrganizationMembership & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    removeMember(id: string, userId: string): Promise<{
        message: string;
    }>;
    getMembers(id: string, status?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("./schemas/organization-membership.schema").OrganizationMembership & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    leaveMembership(id: string, req: any): Promise<{
        message: string;
    }>;
    getOrganizationUsers(id: string, roleId?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("./schemas/organization-membership.schema").OrganizationMembership & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    updateMemberRole(id: string, userId: string, updateMemberRoleDto: UpdateMemberRoleDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("./schemas/organization-membership.schema").OrganizationMembership & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMemberDetails(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("./schemas/organization-membership.schema").OrganizationMembership & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getRoles(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/organization-role.schema").OrganizationRole, {}, {}> & import("./schemas/organization-role.schema").OrganizationRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    createRole(id: string, createRoleDto: CreateRoleDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-role.schema").OrganizationRole, {}, {}> & import("./schemas/organization-role.schema").OrganizationRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateRole(id: string, roleId: string, updateRoleDto: UpdateRoleDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-role.schema").OrganizationRole, {}, {}> & import("./schemas/organization-role.schema").OrganizationRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteRole(id: string, roleId: string): Promise<{
        message: string;
    }>;
    acceptInvitation(id: string, req: any): Promise<{
        message: string;
    }>;
    getOrganizationCourses(id: string, filterDto: OrganizationCourseFilterDto): Promise<{
        success: boolean;
        data: import("../courses/schemas/course.schema").Course[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasMore: boolean;
        };
    }>;
    createOrganizationCourse(id: string, createOrganizationCourseDto: CreateOrganizationCourseDto, req: any): Promise<import("../courses/schemas/course.schema").Course>;
    updateOrganizationCourse(id: string, courseId: string, updateOrganizationCourseDto: UpdateOrganizationCourseDto): Promise<import("../courses/schemas/course.schema").Course>;
    deleteOrganizationCourse(id: string, courseId: string): Promise<{
        message: string;
    }>;
    assignCourseToTerm(id: string, courseId: string, assignTermDto: AssignTermDto): Promise<import("../courses/schemas/course.schema").Course>;
}
