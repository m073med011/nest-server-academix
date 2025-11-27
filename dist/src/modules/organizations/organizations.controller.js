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
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const organizations_service_1 = require("./organizations.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const organizations_dto_1 = require("./dto/organizations.dto");
let OrganizationsController = class OrganizationsController {
    organizationsService;
    constructor(organizationsService) {
        this.organizationsService = organizationsService;
    }
    async create(createOrganizationDto, req) {
        return this.organizationsService.create(createOrganizationDto, req.user._id);
    }
    async findAll() {
        return this.organizationsService.findAll();
    }
    async findOne(id) {
        return this.organizationsService.findOne(id);
    }
    async update(id, updateOrganizationDto) {
        return this.organizationsService.update(id, updateOrganizationDto);
    }
    async remove(id) {
        return this.organizationsService.remove(id);
    }
    async searchUser(searchUserDto) {
        return this.organizationsService.searchUser(searchUserDto.email);
    }
    async addMember(id, addMemberDto) {
        return this.organizationsService.addMember(id, addMemberDto);
    }
    async removeMember(id, userId) {
        return this.organizationsService.removeMember(id, userId);
    }
    async getMembers(id, status) {
        return this.organizationsService.getMembers(id, status);
    }
    async leaveMembership(id, req) {
        return this.organizationsService.leaveMembership(id, req.user._id);
    }
    async getOrganizationUsers(id, roleId) {
        return this.organizationsService.getOrganizationUsers(id, roleId);
    }
    async updateMemberRole(id, userId, updateMemberRoleDto) {
        return this.organizationsService.updateMemberRole(id, userId, updateMemberRoleDto);
    }
    async getMemberDetails(id, userId) {
        return this.organizationsService.getMemberDetails(id, userId);
    }
    async getRoles(id) {
        return this.organizationsService.getRoles(id);
    }
    async createRole(id, createRoleDto) {
        return this.organizationsService.createRole(id, createRoleDto);
    }
    async updateRole(id, roleId, updateRoleDto) {
        return this.organizationsService.updateRole(id, roleId, updateRoleDto);
    }
    async deleteRole(id, roleId) {
        return this.organizationsService.deleteRole(id, roleId);
    }
    async acceptInvitation(id, req) {
        return this.organizationsService.acceptInvitation(id, req.user._id);
    }
    async getOrganizationCourses(id, filterDto) {
        return this.organizationsService.getOrganizationCourses(id, filterDto);
    }
    async createOrganizationCourse(id, createOrganizationCourseDto, req) {
        return this.organizationsService.createOrganizationCourse(id, createOrganizationCourseDto, req.user._id);
    }
    async updateOrganizationCourse(id, courseId, updateOrganizationCourseDto) {
        return this.organizationsService.updateOrganizationCourse(id, courseId, updateOrganizationCourseDto);
    }
    async deleteOrganizationCourse(id, courseId) {
        return this.organizationsService.deleteOrganizationCourse(id, courseId);
    }
    async assignCourseToTerm(id, courseId, assignTermDto) {
        return this.organizationsService.assignCourseToTerm(id, courseId, assignTermDto);
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create organization' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Organization created.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organizations_dto_1.CreateOrganizationDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all organizations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organizations retrieved.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization retrieved.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organizations_dto_1.UpdateOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('search-user'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search user by email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User found.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organizations_dto_1.SearchUserDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "searchUser", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add member to organization' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Member added.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organizations_dto_1.AddMemberDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove member from organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member removed.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization members' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Members retrieved.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)(':id/members/leave'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Leave organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Left organization.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "leaveMembership", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization users by role' }),
    (0, swagger_1.ApiQuery)({ name: 'roleId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users retrieved.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "getOrganizationUsers", null);
__decorate([
    (0, common_1.Patch)(':id/users/:userId/role'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update member role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member role updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, organizations_dto_1.UpdateMemberRoleDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "updateMemberRole", null);
__decorate([
    (0, common_1.Get)(':id/users/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get member details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member details retrieved.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "getMemberDetails", null);
__decorate([
    (0, common_1.Get)(':id/roles'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization roles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Roles retrieved.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Post)(':id/roles'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create organization role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role created.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organizations_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "createRole", null);
__decorate([
    (0, common_1.Patch)(':id/roles/:roleId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update organization role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, organizations_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':id/roles/:roleId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete organization role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Post)(':id/invitations/accept'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Accept organization invitation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invitation accepted.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Get)(':id/courses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization courses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Courses retrieved.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organizations_dto_1.OrganizationCourseFilterDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "getOrganizationCourses", null);
__decorate([
    (0, common_1.Post)(':id/courses'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create organization course' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Course created.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organizations_dto_1.CreateOrganizationCourseDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "createOrganizationCourse", null);
__decorate([
    (0, common_1.Patch)(':id/courses/:courseId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update organization course' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, organizations_dto_1.UpdateOrganizationCourseDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "updateOrganizationCourse", null);
__decorate([
    (0, common_1.Delete)(':id/courses/:courseId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete organization course' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "deleteOrganizationCourse", null);
__decorate([
    (0, common_1.Patch)(':id/courses/:courseId/assign-term'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Assign course to term' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course assigned to term.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, organizations_dto_1.AssignTermDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "assignCourseToTerm", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, swagger_1.ApiTags)('organizations'),
    (0, common_1.Controller)('organizations'),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map