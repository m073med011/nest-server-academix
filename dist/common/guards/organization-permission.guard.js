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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationPermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const organization_membership_repository_1 = require("../../modules/organizations/organization-membership.repository");
const organization_role_repository_1 = require("../../modules/organizations/organization-role.repository");
const organizations_repository_1 = require("../../modules/organizations/organizations.repository");
const organization_membership_schema_1 = require("../../modules/organizations/schemas/organization-membership.schema");
const organization_permission_decorator_1 = require("../decorators/organization-permission.decorator");
let OrganizationPermissionGuard = class OrganizationPermissionGuard {
    reflector;
    membershipRepository;
    roleRepository;
    organizationsRepository;
    constructor(reflector, membershipRepository, roleRepository, organizationsRepository) {
        this.reflector = reflector;
        this.membershipRepository = membershipRepository;
        this.roleRepository = roleRepository;
        this.organizationsRepository = organizationsRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const organizationId = request.params.id;
        if (!organizationId) {
            if (!organizationId) {
                throw new common_1.ForbiddenException('Organization ID is required');
            }
        }
        if (!user || !user._id) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const requireOwner = this.reflector.get(organization_permission_decorator_1.REQUIRE_OWNER_KEY, context.getHandler());
        if (requireOwner) {
            return this.verifyOwnership(organizationId, user._id);
        }
        const requiredPermission = this.reflector.get(organization_permission_decorator_1.ORGANIZATION_PERMISSION_KEY, context.getHandler());
        if (requiredPermission) {
            return this.verifyPermission(organizationId, user._id, requiredPermission);
        }
        return this.verifyActiveMembership(organizationId, user._id);
    }
    async verifyOwnership(organizationId, userId) {
        const organization = await this.organizationsRepository.findById(organizationId);
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        if (organization.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only organization owner can perform this action');
        }
        return true;
    }
    async verifyPermission(organizationId, userId, permission) {
        const membership = await this.membershipRepository.findOne({
            userId,
            organizationId,
            status: organization_membership_schema_1.MembershipStatus.ACTIVE,
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You are not a member of this organization');
        }
        const role = await this.roleRepository.findById(membership.roleId.toString());
        if (!role) {
            throw new common_1.ForbiddenException('Invalid role assignment');
        }
        if (!role.permissions[permission]) {
            throw new common_1.ForbiddenException(`You do not have permission: ${permission}`);
        }
        return true;
    }
    async verifyActiveMembership(organizationId, userId) {
        const membership = await this.membershipRepository.findOne({
            userId,
            organizationId,
            status: organization_membership_schema_1.MembershipStatus.ACTIVE,
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You are not a member of this organization');
        }
        return true;
    }
};
exports.OrganizationPermissionGuard = OrganizationPermissionGuard;
exports.OrganizationPermissionGuard = OrganizationPermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        organization_membership_repository_1.OrganizationMembershipRepository,
        organization_role_repository_1.OrganizationRoleRepository,
        organizations_repository_1.OrganizationsRepository])
], OrganizationPermissionGuard);
//# sourceMappingURL=organization-permission.guard.js.map