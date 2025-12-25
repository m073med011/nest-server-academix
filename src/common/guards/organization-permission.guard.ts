import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationMembershipRepository } from '../../modules/organizations/organization-membership.repository';
import { OrganizationRoleRepository } from '../../modules/organizations/organization-role.repository';
import { OrganizationsRepository } from '../../modules/organizations/organizations.repository';
import { MembershipStatus } from '../../modules/organizations/schemas/organization-membership.schema';
import {
  ORGANIZATION_PERMISSION_KEY,
  REQUIRE_OWNER_KEY,
} from '../decorators/organization-permission.decorator';

@Injectable()
export class OrganizationPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private membershipRepository: OrganizationMembershipRepository,
    private roleRepository: OrganizationRoleRepository,
    private organizationsRepository: OrganizationsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Get organization ID from route params
    const organizationId = request.params.id;

    if (!organizationId) {
      // If organizationId is not in params, it might not be an org-scoped endpoint
      // or the implementation is different. For now, strict check.
      // But looking at the plan, this guard is used on routes like /organizations/:id...
      // However, if the route is applied to the whole controller, some methods like POST / (create) might not have :id
      // So we should check if :id exists before throwing error IF the guard is global or controller-level.
      // But here we will follow the plan which implies it's used on endpoints with :id.
      // If used on create(), we should probably skip this guard or make it smart.
      // Let's stick to the plan's code first.
      
      // Actually, for create() usually we don't need this guard because we are creating it.
      // The controller modifications in Task 1.3 show usage on specific methods or methods that HAVE :id.
      // So this check is valid.
      
      // Wait, if I apply it to methods without :id it will fail.
      // But the plan says:
      // if (!organizationId) { throw new ForbiddenException('Organization ID is required'); }
      // This implies it MUST be used on routes with :id.
      
      // Let's implement as per plan.
      if (!organizationId) {
         // Optimization: If no organization ID and no permission requirements, maybe allow?
         // But the guard is specifically for Organization Permission.
         // Let's assume it's only used where org ID is expected.
         throw new ForbiddenException('Organization ID is required');
      }
    }

    if (!user || !user._id) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if endpoint requires ownership
    const requireOwner = this.reflector.get<boolean>(
      REQUIRE_OWNER_KEY,
      context.getHandler(),
    );

    if (requireOwner) {
      return this.verifyOwnership(organizationId, user._id);
    }

    // Check if endpoint requires specific permission
    const requiredPermission = this.reflector.get<string>(
      ORGANIZATION_PERMISSION_KEY,
      context.getHandler(),
    );

    if (requiredPermission) {
      return this.verifyPermission(organizationId, user._id, requiredPermission);
    }

    // No specific requirement, just verify active membership
    return this.verifyActiveMembership(organizationId, user._id);
  }

  private async verifyOwnership(
    organizationId: string,
    userId: string,
  ): Promise<boolean> {
    const organization = await this.organizationsRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (organization.owner.toString() !== userId) {
      throw new ForbiddenException(
        'Only organization owner can perform this action',
      );
    }

    return true;
  }

  private async verifyPermission(
    organizationId: string,
    userId: string,
    permission: string,
  ): Promise<boolean> {
    // 1. Get user's active membership
    const membership = await this.membershipRepository.findOne({
      userId,
      organizationId,
      status: MembershipStatus.ACTIVE,
    });

    if (!membership) {
      throw new ForbiddenException(
        'You are not a member of this organization',
      );
    }

    // 2. Get role with permissions
    const role = await this.roleRepository.findById(
      membership.roleId.toString(),
    );

    if (!role) {
      throw new ForbiddenException('Invalid role assignment');
    }

    // 3. Check specific permission
    if (!role.permissions[permission]) {
      throw new ForbiddenException(
        `You do not have permission: ${permission}`,
      );
    }

    return true;
  }

  private async verifyActiveMembership(
    organizationId: string,
    userId: string,
  ): Promise<boolean> {
    const membership = await this.membershipRepository.findOne({
      userId,
      organizationId,
      status: MembershipStatus.ACTIVE,
    });

    if (!membership) {
      throw new ForbiddenException(
        'You are not a member of this organization',
      );
    }

    return true;
  }
}
