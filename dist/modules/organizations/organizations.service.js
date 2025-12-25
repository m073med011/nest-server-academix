"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const organizations_repository_1 = require("./organizations.repository");
const organization_membership_repository_1 = require("./organization-membership.repository");
const organization_role_repository_1 = require("./organization-role.repository");
const term_repository_1 = require("./term.repository");
const users_service_1 = require("../users/users.service");
const courses_service_1 = require("../courses/courses.service");
const users_repository_1 = require("../users/users.repository");
const organization_membership_schema_1 = require("./schemas/organization-membership.schema");
let OrganizationsService = class OrganizationsService {
    organizationsRepository;
    membershipRepository;
    roleRepository;
    termRepository;
    usersService;
    coursesService;
    usersRepository;
    constructor(organizationsRepository, membershipRepository, roleRepository, termRepository, usersService, coursesService, usersRepository) {
        this.organizationsRepository = organizationsRepository;
        this.membershipRepository = membershipRepository;
        this.roleRepository = roleRepository;
        this.termRepository = termRepository;
        this.usersService = usersService;
        this.coursesService = coursesService;
        this.usersRepository = usersRepository;
    }
    async create(createOrganizationDto, ownerId) {
        const org = await this.organizationsRepository.create({
            ...createOrganizationDto,
            owner: ownerId,
        });
        const adminRoleDto = {
            name: 'Admin',
            organizationId: org._id,
            permissions: {
                canManageOrganization: true,
                canManageLevels: true,
                canManageTerms: true,
                canManageCourses: true,
                canManageStudents: true,
                canManageRoles: true,
                canRecordAttendance: true,
                canViewReports: true,
            },
            isSystemRole: true,
        };
        const adminRole = await this.roleRepository.create(adminRoleDto);
        await this.roleRepository.create({
            name: 'Instructor',
            organizationId: org._id,
            permissions: {
                canManageOrganization: false,
                canManageLevels: false,
                canManageTerms: false,
                canManageCourses: true,
                canManageStudents: true,
                canManageRoles: false,
                canRecordAttendance: true,
                canViewReports: false,
            },
            isSystemRole: true,
        });
        await this.roleRepository.create({
            name: 'Student',
            organizationId: org._id,
            permissions: {
                canManageOrganization: false,
                canManageLevels: false,
                canManageTerms: false,
                canManageCourses: false,
                canManageStudents: false,
                canManageRoles: false,
                canRecordAttendance: false,
                canViewReports: false,
            },
            isSystemRole: true,
        });
        const membershipDto = {
            userId: ownerId,
            organizationId: org._id,
            roleId: adminRole._id,
            status: organization_membership_schema_1.MembershipStatus.ACTIVE,
        };
        await this.membershipRepository.create(membershipDto);
        return org;
    }
    async findAll() {
        return this.organizationsRepository.findAll();
    }
    async findOne(id) {
        const org = await this.organizationsRepository.findById(id);
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        return org;
    }
    async update(id, updateOrganizationDto) {
        const org = await this.organizationsRepository.update(id, updateOrganizationDto);
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        return org;
    }
    async remove(id, requesterId) {
        const org = await this.organizationsRepository.findById(id);
        if (!org) {
            throw new common_1.NotFoundException('Organization not found');
        }
        if (org.owner.toString() !== requesterId) {
            throw new common_1.ForbiddenException('Only organization owner can delete organization');
        }
        if (org.deletedAt) {
            throw new common_1.BadRequestException('Organization is already deleted');
        }
        org.deletedAt = new Date();
        org.deletedBy = requesterId;
        await org.save();
        try {
            const memberships = await this.membershipRepository.find({
                organizationId: id,
                status: organization_membership_schema_1.MembershipStatus.ACTIVE,
            });
            for (const membership of memberships) {
                membership.status = organization_membership_schema_1.MembershipStatus.LEFT;
                membership.leftAt = new Date();
                await membership.save();
            }
            await this.usersRepository.updateMany({ lastActiveOrganization: id }, { $set: { lastActiveOrganization: null } });
            await this.coursesService.archiveByOrganization(id);
            return {
                message: 'Organization deleted successfully',
                deletedAt: org.deletedAt,
                affectedMemberships: memberships.length,
            };
        }
        catch (error) {
            org.deletedAt = null;
            org.deletedBy = null;
            await org.save();
            throw new common_1.BadRequestException(`Failed to delete organization: ${error.message}`);
        }
    }
    async restore(id, requesterId) {
        const org = await this.organizationsRepository.findById(id);
        if (!org) {
            throw new common_1.NotFoundException('Organization not found');
        }
        if (!org.deletedAt) {
            throw new common_1.BadRequestException('Organization is not deleted');
        }
        if (org.owner.toString() !== requesterId) {
            throw new common_1.ForbiddenException('Only organization owner can restore organization');
        }
        org.deletedAt = null;
        org.deletedBy = null;
        await org.save();
        return {
            message: 'Organization restored successfully',
            restoredAt: new Date(),
        };
    }
    async permanentDelete(id, requesterId) {
        const org = await this.organizationsRepository.findById(id);
        if (!org) {
            throw new common_1.NotFoundException('Organization not found');
        }
        if (!org.deletedAt) {
            throw new common_1.BadRequestException('Organization must be soft-deleted before permanent deletion');
        }
        if (org.owner.toString() !== requesterId) {
            throw new common_1.ForbiddenException('Only organization owner can permanently delete organization');
        }
        const results = {
            memberships: 0,
            roles: 0,
            terms: 0,
            courses: 0,
        };
        const membershipResult = await this.membershipRepository.deleteMany({
            organizationId: id,
        });
        results.memberships = membershipResult.deletedCount;
        const roleResult = await this.roleRepository.deleteMany({
            organizationId: id,
        });
        results.roles = roleResult.deletedCount;
        const termResult = await this.termRepository.deleteMany({
            organizationId: id,
        });
        results.terms = termResult.deletedCount;
        const courseResult = await this.coursesService.permanentDeleteByOrganization(id);
        results.courses = courseResult.deletedCount;
        await this.usersRepository.updateMany({ lastActiveOrganization: id }, { $set: { lastActiveOrganization: null } });
        await this.organizationsRepository.delete(id);
        return {
            message: 'Organization permanently deleted',
            deletedRecords: results,
        };
    }
    async findDeletedForUser(userId) {
        const allDeleted = await this.organizationsRepository.findDeleted();
        return allDeleted.filter((org) => org.owner.toString() === userId);
    }
    async searchUser(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async addMember(organizationId, addMemberDto) {
        const existingMember = await this.membershipRepository.findOne({
            organizationId,
            userId: addMemberDto.userId,
            status: organization_membership_schema_1.MembershipStatus.ACTIVE,
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a member');
        }
        const membershipDto = {
            ...addMemberDto,
            organizationId,
            status: organization_membership_schema_1.MembershipStatus.ACTIVE,
        };
        return this.membershipRepository.create(membershipDto);
    }
    async removeMember(organizationId, userId) {
        const membership = await this.membershipRepository.findOne({
            organizationId,
            userId,
            status: organization_membership_schema_1.MembershipStatus.ACTIVE,
        });
        if (!membership)
            throw new common_1.NotFoundException('Member not found');
        membership.status = organization_membership_schema_1.MembershipStatus.LEFT;
        membership.leftAt = new Date();
        await membership.save();
        return { message: 'Member removed successfully' };
    }
    async getMembers(organizationId, queryDto) {
        const { page = 1, limit = 50, status, roleId, levelId, termId } = queryDto;
        const filter = { organizationId };
        if (status)
            filter.status = status;
        if (roleId)
            filter.roleId = roleId;
        if (levelId)
            filter.levelId = levelId;
        if (termId)
            filter.termId = termId;
        const { data, total } = await this.membershipRepository.findPaginated(filter, {
            page,
            limit,
            sort: { joinedAt: -1 },
            populate: ['userId', 'roleId', 'levelId', 'termId'],
        });
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
    async leaveMembership(organizationId, userId) {
        return this.removeMember(organizationId, userId);
    }
    async getOrganizationUsers(organizationId, queryDto) {
        return this.getMembers(organizationId, {
            ...queryDto,
            status: organization_membership_schema_1.MembershipStatus.ACTIVE,
        });
    }
    async updateMemberRole(organizationId, userId, updateMemberRoleDto) {
        const membership = await this.membershipRepository.findOne({
            organizationId,
            userId,
            status: organization_membership_schema_1.MembershipStatus.ACTIVE,
        });
        if (!membership)
            throw new common_1.NotFoundException('Member not found');
        if (updateMemberRoleDto.roleId)
            membership.roleId = updateMemberRoleDto.roleId;
        if (updateMemberRoleDto.levelId)
            membership.levelId = updateMemberRoleDto.levelId;
        if (updateMemberRoleDto.termId)
            membership.termId = updateMemberRoleDto.termId;
        await membership.save();
        return membership;
    }
    async getMemberDetails(organizationId, userId) {
        const membership = await this.membershipRepository.findOne({
            organizationId,
            userId,
        });
        if (!membership)
            throw new common_1.NotFoundException('Member not found');
        return membership;
    }
    async getRoles(organizationId) {
        return this.roleRepository.find({ organizationId });
    }
    async createRole(organizationId, createRoleDto) {
        return this.roleRepository.create({ ...createRoleDto, organizationId });
    }
    async updateRole(organizationId, roleId, updateRoleDto) {
        const role = await this.roleRepository.update(roleId, updateRoleDto);
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        return role;
    }
    async deleteRole(organizationId, roleId) {
        const role = await this.roleRepository.findById(roleId);
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        if (role.isSystemRole)
            throw new common_1.BadRequestException('Cannot delete system role');
        await this.roleRepository.delete(roleId);
        return { message: 'Role deleted successfully' };
    }
    async acceptInvitation(organizationId, userId) {
        return { message: 'Invitation accepted' };
    }
    async getOrganizationCourses(organizationId, filterDto) {
        const filter = { organizationId };
        if (filterDto.termId)
            filter.termId = filterDto.termId;
        if (filterDto.levelId)
            filter.levelId = filterDto.levelId;
        if (filterDto.instructor)
            filter.instructor = filterDto.instructor;
        if (filterDto.isPublished)
            filter.isPublished = filterDto.isPublished === 'true';
        return this.coursesService.findAll(filter);
    }
    async createOrganizationCourse(organizationId, createDto, instructorId) {
        return this.coursesService.create({ ...createDto, organizationId }, instructorId);
    }
    async updateOrganizationCourse(organizationId, courseId, updateDto) {
        return this.coursesService.update(courseId, updateDto);
    }
    async deleteOrganizationCourse(organizationId, courseId) {
        return this.coursesService.remove(courseId);
    }
    async assignCourseToTerm(organizationId, courseId, assignTermDto) {
        return this.coursesService.update(courseId, {
            termId: assignTermDto.termId,
        });
    }
    async addLevel(organizationId, levelId) {
        return this.organizationsRepository.addLevel(organizationId, levelId);
    }
    async addTerm(organizationId, termId) {
        return this.organizationsRepository.addTerm(organizationId, termId);
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => courses_service_1.CoursesService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_repository_1.UsersRepository))),
    __metadata("design:paramtypes", [organizations_repository_1.OrganizationsRepository,
        organization_membership_repository_1.OrganizationMembershipRepository,
        organization_role_repository_1.OrganizationRoleRepository,
        term_repository_1.TermRepository,
        users_service_1.UsersService,
        courses_service_1.CoursesService,
        users_repository_1.UsersRepository])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map