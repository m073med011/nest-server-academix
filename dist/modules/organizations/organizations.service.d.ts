import { Types } from 'mongoose';
import { OrganizationsRepository } from './organizations.repository';
import { OrganizationMembershipRepository } from './organization-membership.repository';
import { OrganizationRoleRepository } from './organization-role.repository';
import { TermRepository } from './term.repository';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { UsersRepository } from '../users/users.repository';
import { CreateOrganizationDto, UpdateOrganizationDto, AddMemberDto, UpdateMemberRoleDto, CreateRoleDto, UpdateRoleDto, CreateOrganizationCourseDto, UpdateOrganizationCourseDto, AssignTermDto, OrganizationCourseFilterDto, PaginatedResponse, GetMembersDto } from './dto/organizations.dto';
import { OrganizationMembershipDocument } from './schemas/organization-membership.schema';
export declare class OrganizationsService {
    private readonly organizationsRepository;
    private readonly membershipRepository;
    private readonly roleRepository;
    private readonly termRepository;
    private readonly usersService;
    private readonly coursesService;
    private readonly usersRepository;
    constructor(organizationsRepository: OrganizationsRepository, membershipRepository: OrganizationMembershipRepository, roleRepository: OrganizationRoleRepository, termRepository: TermRepository, usersService: UsersService, coursesService: CoursesService, usersRepository: UsersRepository);
    create(createOrganizationDto: CreateOrganizationDto, ownerId: string): Promise<import("./schemas/organization.schema").OrganizationDocument>;
    findAll(): Promise<import("./schemas/organization.schema").OrganizationDocument[]>;
    findOne(id: string): Promise<import("./schemas/organization.schema").OrganizationDocument>;
    update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<import("./schemas/organization.schema").OrganizationDocument>;
    remove(id: string, requesterId: string): Promise<{
        message: string;
        deletedAt: Date;
        affectedMemberships: number;
    }>;
    restore(id: string, requesterId: string): Promise<{
        message: string;
        restoredAt: Date;
    }>;
    permanentDelete(id: string, requesterId: string): Promise<{
        message: string;
        deletedRecords: {
            memberships: number;
            roles: number;
            terms: number;
            courses: number;
        };
    }>;
    findDeletedForUser(userId: string): Promise<import("./schemas/organization.schema").OrganizationDocument[]>;
    searchUser(email: string): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, {}> & Omit<import("../users/schemas/user.schema").User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "matchPassword"> & import("../users/schemas/user.schema").UserMethods>;
    addMember(organizationId: string, addMemberDto: AddMemberDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("./schemas/organization-membership.schema").OrganizationMembership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    removeMember(organizationId: string, userId: string): Promise<{
        message: string;
    }>;
    getMembers(organizationId: string, queryDto: GetMembersDto): Promise<PaginatedResponse<OrganizationMembershipDocument>>;
    leaveMembership(organizationId: string, userId: string): Promise<{
        message: string;
    }>;
    getOrganizationUsers(organizationId: string, queryDto: GetMembersDto): Promise<PaginatedResponse<OrganizationMembershipDocument>>;
    updateMemberRole(organizationId: string, userId: string, updateMemberRoleDto: UpdateMemberRoleDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("./schemas/organization-membership.schema").OrganizationMembership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMemberDetails(organizationId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("./schemas/organization-membership.schema").OrganizationMembership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getRoles(organizationId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/organization-role.schema").OrganizationRole, {}, {}> & import("./schemas/organization-role.schema").OrganizationRole & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    createRole(organizationId: string, createRoleDto: CreateRoleDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-role.schema").OrganizationRole, {}, {}> & import("./schemas/organization-role.schema").OrganizationRole & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateRole(organizationId: string, roleId: string, updateRoleDto: UpdateRoleDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/organization-role.schema").OrganizationRole, {}, {}> & import("./schemas/organization-role.schema").OrganizationRole & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteRole(organizationId: string, roleId: string): Promise<{
        message: string;
    }>;
    acceptInvitation(organizationId: string, userId: string): Promise<{
        message: string;
    }>;
    getOrganizationCourses(organizationId: string, filterDto: OrganizationCourseFilterDto): Promise<{
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
    createOrganizationCourse(organizationId: string, createDto: CreateOrganizationCourseDto, instructorId: string): Promise<import("../courses/schemas/course.schema").Course>;
    updateOrganizationCourse(organizationId: string, courseId: string, updateDto: UpdateOrganizationCourseDto): Promise<import("../courses/schemas/course.schema").Course>;
    deleteOrganizationCourse(organizationId: string, courseId: string): Promise<{
        message: string;
    }>;
    assignCourseToTerm(organizationId: string, courseId: string, assignTermDto: AssignTermDto): Promise<import("../courses/schemas/course.schema").Course>;
    addLevel(organizationId: string, levelId: string): Promise<import("./schemas/organization.schema").OrganizationDocument | null>;
    addTerm(organizationId: string, termId: string): Promise<import("./schemas/organization.schema").OrganizationDocument | null>;
}
