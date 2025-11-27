import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OrganizationsRepository } from './organizations.repository';
import { OrganizationMembershipRepository } from './organization-membership.repository';
import { OrganizationRoleRepository } from './organization-role.repository';
import { TermRepository } from './term.repository';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
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
} from './dto/organizations.dto';
import { MembershipStatus } from './schemas/organization-membership.schema';

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
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto, ownerId: string) {
    const org = await this.organizationsRepository.create({
      ...createOrganizationDto,
      ownerId,
    });

    // Create default roles
    const adminRole = await this.roleRepository.create({
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
    } as any);

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
    await this.membershipRepository.create({
      userId: ownerId,
      organizationId: org._id,
      roleId: adminRole._id,
      status: MembershipStatus.ACTIVE,
    } as any);

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

  async remove(id: string) {
    const org = await this.organizationsRepository.delete(id);
    if (!org) throw new NotFoundException('Organization not found');
    return { message: 'Organization deleted successfully' };
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

    return this.membershipRepository.create({
      ...addMemberDto,
      organizationId,
      status: MembershipStatus.ACTIVE,
    } as any);
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

  async getMembers(organizationId: string, status?: string) {
    const filter: any = { organizationId };
    if (status) filter.status = status;
    return this.membershipRepository.find(filter);
  }

  async leaveMembership(organizationId: string, userId: string) {
    return this.removeMember(organizationId, userId);
  }

  async getOrganizationUsers(organizationId: string, roleId?: string) {
    const filter: any = { organizationId, status: MembershipStatus.ACTIVE };
    if (roleId) filter.roleId = roleId;
    return this.membershipRepository.find(filter);
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
}
