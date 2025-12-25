import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OrganizationsRepository } from './organizations.repository';
import { OrganizationMembershipRepository } from './organization-membership.repository';
import { OrganizationRoleRepository } from './organization-role.repository';
import { TermRepository } from './term.repository';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { UsersRepository } from '../users/users.repository';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  AddMemberDto,
  UpdateMemberRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  CreateOrganizationCourseDto,
  UpdateOrganizationCourseDto,
  AssignTermDto,
  OrganizationCourseFilterDto,
  PaginatedResponse,
  GetMembersDto,
} from './dto/organizations.dto';
import {
  MembershipStatus,
  OrganizationMembershipDocument,
} from './schemas/organization-membership.schema';
import {
  CreateMembershipDto,
  CreateRoleDto as CreateRoleRepoDto,
} from './dto/repository.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly membershipRepository: OrganizationMembershipRepository,
    private readonly roleRepository: OrganizationRoleRepository,
    private readonly termRepository: TermRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto, ownerId: string) {
    const org = await this.organizationsRepository.create({
      ...createOrganizationDto,
      owner: ownerId,
    });

    // Create default roles
    const adminRoleDto: CreateRoleRepoDto = {
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
    } as any);

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
    } as any);

    // Add owner as member with Admin role
    const membershipDto: CreateMembershipDto = {
      userId: ownerId,
      organizationId: org._id,
      roleId: adminRole._id,
      status: MembershipStatus.ACTIVE,
    };

    await this.membershipRepository.create(membershipDto);

    return org;
  }

  async findAll() {
    return this.organizationsRepository.findAll();
  }

  async findOne(id: string) {
    const org = await this.organizationsRepository.findById(id);
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const org = await this.organizationsRepository.update(
      id,
      updateOrganizationDto,
    );
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  /**
   * Soft delete organization with cascade cleanup
   * @param id - Organization ID
   * @param requesterId - User ID requesting deletion (must be owner)
   */
  async remove(id: string, requesterId: string) {
    // 1. Verify organization exists
    const org = await this.organizationsRepository.findById(id);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    // 2. Verify requester is owner (double-check, guard should handle this)
    if (org.owner.toString() !== requesterId) {
      throw new ForbiddenException(
        'Only organization owner can delete organization',
      );
    }

    // 3. Check if already deleted
    if (org.deletedAt) {
      throw new BadRequestException('Organization is already deleted');
    }

    // 4. Mark organization as deleted (soft delete)
    org.deletedAt = new Date();
    org.deletedBy = requesterId as any;
    await org.save();

    // 5. Cascade operations (in transaction-like pattern)
    try {
      // 5a. Mark all memberships as LEFT
      const memberships = await this.membershipRepository.find({
        organizationId: id,
        status: MembershipStatus.ACTIVE,
      });

      for (const membership of memberships) {
        membership.status = MembershipStatus.LEFT;
        membership.leftAt = new Date();
        await membership.save();
      }

      // 5b. Clear lastActiveOrganization for affected users
      await this.usersRepository.updateMany(
        { lastActiveOrganization: id },
        { $set: { lastActiveOrganization: null } },
      );

      // 5c. Soft delete or archive courses
      await this.coursesService.archiveByOrganization(id);

      // 5d. Keep roles and terms for audit trail (don't delete)
      // They're referenced by historical memberships

      return {
        message: 'Organization deleted successfully',
        deletedAt: org.deletedAt,
        affectedMemberships: memberships.length,
      };
    } catch (error) {
      // Rollback soft delete if cascade fails
      org.deletedAt = null;
      org.deletedBy = null;
      await org.save();

      throw new BadRequestException(
        `Failed to delete organization: ${error.message}`,
      );
    }
  }

  /**
   * Restore soft-deleted organization (admin only)
   * @param id - Organization ID
   * @param requesterId - Admin user ID
   */
  async restore(id: string, requesterId: string) {
    const org = await this.organizationsRepository.findById(id);

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    if (!org.deletedAt) {
      throw new BadRequestException('Organization is not deleted');
    }

    // Verify requester is owner
    if (org.owner.toString() !== requesterId) {
      throw new ForbiddenException(
        'Only organization owner can restore organization',
      );
    }

    // Restore organization
    org.deletedAt = null;
    org.deletedBy = null;
    await org.save();

    return {
      message: 'Organization restored successfully',
      restoredAt: new Date(),
    };
  }

  /**
   * Permanently delete organization and all related data
   * WARNING: This is irreversible
   * @param id - Organization ID
   * @param requesterId - Owner user ID
   */
  async permanentDelete(id: string, requesterId: string) {
    const org = await this.organizationsRepository.findById(id);

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    // Must be soft-deleted first
    if (!org.deletedAt) {
      throw new BadRequestException(
        'Organization must be soft-deleted before permanent deletion',
      );
    }

    // Verify requester is owner
    if (org.owner.toString() !== requesterId) {
      throw new ForbiddenException(
        'Only organization owner can permanently delete organization',
      );
    }

    // Permanent cascade delete
    const results = {
      memberships: 0,
      roles: 0,
      terms: 0,
      courses: 0,
    };

    // Delete all memberships
    const membershipResult = await this.membershipRepository.deleteMany({
      organizationId: id,
    });
    results.memberships = membershipResult.deletedCount;

    // Delete all roles
    const roleResult = await this.roleRepository.deleteMany({
      organizationId: id,
    });
    results.roles = roleResult.deletedCount;

    // Delete all terms
    const termResult = await this.termRepository.deleteMany({
      organizationId: id,
    });
    results.terms = termResult.deletedCount;

    // Delete courses
    const courseResult = await this.coursesService.permanentDeleteByOrganization(
      id,
    );
    results.courses = courseResult.deletedCount;

    // Clear user references
    await this.usersRepository.updateMany(
      { lastActiveOrganization: id },
      { $set: { lastActiveOrganization: null } },
    );

    // Finally delete organization
    await this.organizationsRepository.delete(id);

    return {
      message: 'Organization permanently deleted',
      deletedRecords: results,
    };
  }

  async findDeletedForUser(userId: string) {
    const allDeleted = await this.organizationsRepository.findDeleted();
    return allDeleted.filter((org) => org.owner.toString() === userId);
  }

  // User Management
  async searchUser(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async addMember(organizationId: string, addMemberDto: AddMemberDto) {
    const existingMember = await this.membershipRepository.findOne({
      organizationId,
      userId: addMemberDto.userId,
      status: MembershipStatus.ACTIVE,
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member');
    }

    const membershipDto: CreateMembershipDto = {
      ...addMemberDto,
      organizationId,
      status: MembershipStatus.ACTIVE,
    };

    return this.membershipRepository.create(membershipDto);
  }

  async removeMember(organizationId: string, userId: string) {
    const membership = await this.membershipRepository.findOne({
      organizationId,
      userId,
      status: MembershipStatus.ACTIVE,
    });

    if (!membership) throw new NotFoundException('Member not found');

    membership.status = MembershipStatus.LEFT;
    membership.leftAt = new Date();
    await membership.save();

    return { message: 'Member removed successfully' };
  }

  async getMembers(
    organizationId: string,
    queryDto: GetMembersDto,
  ): Promise<PaginatedResponse<OrganizationMembershipDocument>> {
    const { page = 1, limit = 50, status, roleId, levelId, termId } = queryDto;

    // Build filter
    const filter: any = { organizationId };
    if (status) filter.status = status;
    if (roleId) filter.roleId = roleId;
    if (levelId) filter.levelId = levelId;
    if (termId) filter.termId = termId;

    // Get paginated results
    const { data, total } = await this.membershipRepository.findPaginated(
      filter,
      {
        page,
        limit,
        sort: { joinedAt: -1 },
        populate: ['userId', 'roleId', 'levelId', 'termId'],
      },
    );

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

  async leaveMembership(organizationId: string, userId: string) {
    return this.removeMember(organizationId, userId);
  }

  async getOrganizationUsers(
    organizationId: string,
    queryDto: GetMembersDto,
  ): Promise<PaginatedResponse<OrganizationMembershipDocument>> {
    // Force status to ACTIVE for this endpoint
    return this.getMembers(organizationId, {
      ...queryDto,
      status: MembershipStatus.ACTIVE,
    });
  }

  async updateMemberRole(
    organizationId: string,
    userId: string,
    updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    const membership = await this.membershipRepository.findOne({
      organizationId,
      userId,
      status: MembershipStatus.ACTIVE,
    });

    if (!membership) throw new NotFoundException('Member not found');

    if (updateMemberRoleDto.roleId)
      membership.roleId = updateMemberRoleDto.roleId as any;
    if (updateMemberRoleDto.levelId)
      membership.levelId = updateMemberRoleDto.levelId as any;
    if (updateMemberRoleDto.termId)
      membership.termId = updateMemberRoleDto.termId as any;

    await membership.save();
    return membership;
  }

  async getMemberDetails(organizationId: string, userId: string) {
    const membership = await this.membershipRepository.findOne({
      organizationId,
      userId,
    });
    if (!membership) throw new NotFoundException('Member not found');
    return membership;
  }

  // Role Management
  async getRoles(organizationId: string) {
    return this.roleRepository.find({ organizationId });
  }

  async createRole(organizationId: string, createRoleDto: CreateRoleDto) {
    return this.roleRepository.create({ ...createRoleDto, organizationId });
  }

  async updateRole(
    organizationId: string,
    roleId: string,
    updateRoleDto: UpdateRoleDto,
  ) {
    const role = await this.roleRepository.update(roleId, updateRoleDto);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async deleteRole(organizationId: string, roleId: string) {
    const role = await this.roleRepository.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystemRole)
      throw new BadRequestException('Cannot delete system role');
    await this.roleRepository.delete(roleId);
    return { message: 'Role deleted successfully' };
  }

  async acceptInvitation(organizationId: string, userId: string) {
    // Logic for accepting invitation if we had an invitation system.
    // For now, addMember adds directly as active.
    // This might be for future use or if we change addMember to create pending invites.
    return { message: 'Invitation accepted' };
  }

  // Course Management
  async getOrganizationCourses(
    organizationId: string,
    filterDto: OrganizationCourseFilterDto,
  ) {
    const filter: any = { organizationId };
    if (filterDto.termId) filter.termId = filterDto.termId;
    if (filterDto.levelId) filter.levelId = filterDto.levelId;
    if (filterDto.instructor) filter.instructor = filterDto.instructor;
    if (filterDto.isPublished)
      filter.isPublished = filterDto.isPublished === 'true';

    return this.coursesService.findAll(filter as any);
  }

  async createOrganizationCourse(
    organizationId: string,
    createDto: CreateOrganizationCourseDto,
    instructorId: string,
  ) {
    return this.coursesService.create(
      { ...createDto, organizationId } as any,
      instructorId,
    );
  }

  async updateOrganizationCourse(
    organizationId: string,
    courseId: string,
    updateDto: UpdateOrganizationCourseDto,
  ) {
    return this.coursesService.update(courseId, updateDto as any);
  }

  async deleteOrganizationCourse(organizationId: string, courseId: string) {
    return this.coursesService.remove(courseId);
  }

  async assignCourseToTerm(
    organizationId: string,
    courseId: string,
    assignTermDto: AssignTermDto,
  ) {
    return this.coursesService.update(courseId, {
      termId: assignTermDto.termId,
    } as any);
  }

  async addLevel(organizationId: string, levelId: string) {
    return this.organizationsRepository.addLevel(organizationId, levelId);
  }

  async addTerm(organizationId: string, termId: string) {
    return this.organizationsRepository.addTerm(organizationId, termId);
  }
}
