import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationMembershipRepository } from '../../modules/organizations/organization-membership.repository';
import { OrganizationRoleRepository } from '../../modules/organizations/organization-role.repository';
import { OrganizationsRepository } from '../../modules/organizations/organizations.repository';
export declare class OrganizationPermissionGuard implements CanActivate {
    private reflector;
    private membershipRepository;
    private roleRepository;
    private organizationsRepository;
    constructor(reflector: Reflector, membershipRepository: OrganizationMembershipRepository, roleRepository: OrganizationRoleRepository, organizationsRepository: OrganizationsRepository);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private verifyOwnership;
    private verifyPermission;
    private verifyActiveMembership;
}
