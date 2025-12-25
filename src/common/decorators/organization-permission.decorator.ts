import { SetMetadata } from '@nestjs/common';

export const ORGANIZATION_PERMISSION_KEY = 'organizationPermission';

/**
 * Decorator to specify required organization permission for an endpoint
 * @param permission - The permission key from RolePermissions
 * @example
 * @RequirePermission('canManageStudents')
 * async addMember() { ... }
 */
export const RequirePermission = (permission: string) =>
  SetMetadata(ORGANIZATION_PERMISSION_KEY, permission);

export const REQUIRE_OWNER_KEY = 'requireOwner';

/**
 * Decorator to require organization ownership for an endpoint
 * Used for destructive operations like delete
 * @example
 * @RequireOwner()
 * async deleteOrganization() { ... }
 */
export const RequireOwner = () => SetMetadata(REQUIRE_OWNER_KEY, true);
