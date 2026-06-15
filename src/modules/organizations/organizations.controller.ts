import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  SearchUserDto,
  AddMemberDto,
  UpdateMemberRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  GetMembersDto,
  AddCoursesDto,
} from './dto/organizations.dto';
import { OrganizationPermissionGuard } from '../../common/guards/organization-permission.guard';
import {
  RequirePermission,
  RequireOwner,
} from '../../common/decorators/organization-permission.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiTags('Organizations org management')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create organization' })
  @ApiResponse({ status: 201, description: 'Organization created.' })
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Request() req,
  ) {
    return this.organizationsService.create(
      createOrganizationDto,
      req.user._id,
    );
  }

  @Get()
  @ApiTags('Organizations org management')
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved.' })
  async findAll() {
    return this.organizationsService.findAll();
  }

  @Get('deleted')
  @ApiTags('Organizations org management')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get deleted organizations (owner only)' })
  async getDeleted(@Request() req) {
    return this.organizationsService.findDeletedForUser(req.user._id);
  }

  @Get(':id')
  @ApiTags('Organizations org management')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization retrieved.' })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @ApiTags('Organizations org management')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequirePermission('canManageOrganization')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ status: 200, description: 'Organization updated.' })
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiTags('Organizations org management')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequireOwner()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete organization (soft or permanent)' })
  @ApiQuery({ name: 'permanent', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Organization deleted.' })
  async remove(
    @Param('id') id: string,
    @Request() req,
    @Query('permanent') permanent?: string,
  ) {
    if (permanent === 'true') {
      return this.organizationsService.permanentDelete(id, req.user._id);
    }
    return this.organizationsService.remove(id, req.user._id);
  }

  @Post(':id/restore')
  @ApiTags('Organizations org management')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequireOwner()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore deleted organization' })
  @ApiResponse({ status: 200, description: 'Organization restored.' })
  async restore(@Param('id') id: string, @Request() req) {
    return this.organizationsService.restore(id, req.user._id);
  }

  // User Management

  @Post(':id/members')
  @ApiTags('Organizations users mangment')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequirePermission('canManageStudents')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add member to organization' })
  @ApiResponse({ status: 201, description: 'Member added.' })
  async addMember(@Param('id') id: string, @Body() addMemberDto: AddMemberDto) {
    return this.organizationsService.addMember(id, addMemberDto);
  }

  @Delete(':id/members/:userId')
  @ApiTags('Organizations users mangment')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequirePermission('canManageStudents')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove member from organization' })
  @ApiResponse({ status: 200, description: 'Member removed.' })
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.organizationsService.removeMember(id, userId);
  }

  @Get(':id/members')
  @ApiTags('Organizations users mangment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization members (paginated)' })
  @ApiResponse({
    status: 200,
    description: 'Members retrieved with pagination.',
  })
  async getMembers(@Param('id') id: string, @Query() queryDto: GetMembersDto) {
    return this.organizationsService.getMembers(id, queryDto);
  }

  @Post(':id/members/leave')
  @ApiTags('Organizations users mangment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave organization' })
  @ApiResponse({ status: 200, description: 'Left organization.' })
  async leaveMembership(@Param('id') id: string, @Request() req) {
    return this.organizationsService.leaveMembership(id, req.user._id);
  }

  @Get(':id/members/all')
  @ApiTags('Organizations users mangment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization users (paginated)' })
  @ApiResponse({
    status: 200,
    description: 'Active users retrieved with pagination.',
  })
  async getOrganizationUsers(
    @Param('id') id: string,
    @Query() queryDto: GetMembersDto,
  ) {
    return this.organizationsService.getOrganizationUsers(id, queryDto);
  }

  @Patch(':id/members/:userId/role')
  @ApiTags('Organizations users mangment')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequirePermission('canManageRoles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update member role' })
  @ApiResponse({ status: 200, description: 'Member role updated.' })
  async updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    return this.organizationsService.updateMemberRole(
      id,
      userId,
      updateMemberRoleDto,
    );
  }

  @Get(':id/members/:userId')
  @ApiTags('Organizations users mangment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get member details' })
  @ApiResponse({ status: 200, description: 'Member details retrieved.' })
  async getMemberDetails(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.organizationsService.getMemberDetails(id, userId);
  }

  // Role Management
  @Get(':id/roles')
  @ApiTags('Organizations roles mangment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization roles' })
  @ApiResponse({ status: 200, description: 'Roles retrieved.' })
  async getRoles(@Param('id') id: string) {
    return this.organizationsService.getRoles(id);
  }

  @Post(':id/roles')
  @ApiTags('Organizations roles mangment')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequirePermission('canManageRoles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create organization role' })
  @ApiResponse({ status: 201, description: 'Role created.' })
  async createRole(
    @Param('id') id: string,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.organizationsService.createRole(id, createRoleDto);
  }

  @Patch(':id/roles/:roleId')
  @ApiTags('Organizations roles mangment')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequirePermission('canManageRoles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization role' })
  @ApiResponse({ status: 200, description: 'Role updated.' })
  async updateRole(
    @Param('id') id: string,
    @Param('roleId') roleId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.organizationsService.updateRole(id, roleId, updateRoleDto);
  }

  @Delete(':id/roles/:roleId')
  @ApiTags('Organizations roles mangment')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequirePermission('canManageRoles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete organization role' })
  @ApiResponse({ status: 200, description: 'Role deleted.' })
  async deleteRole(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.organizationsService.deleteRole(id, roleId);
  }

  @Post(':id/invitations/accept')
  @ApiTags('Organizations users mangment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept organization invitation' })
  @ApiResponse({ status: 200, description: 'Invitation accepted.' })
  async acceptInvitation(@Param('id') id: string, @Request() req) {
    return this.organizationsService.acceptInvitation(id, req.user._id);
  }

  @Post(':id/courses')
  @ApiTags('Organizations courses mangment')
  @UseGuards(AuthGuard('jwt'), OrganizationPermissionGuard)
  @RequirePermission('canManageCourses')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add courses to organization' })
  @ApiResponse({ status: 200, description: 'Courses added.' })
  async addCourses(
    @Param('id') id: string,
    @Body() addCoursesDto: AddCoursesDto,
  ) {
    return this.organizationsService.addCourses(id, addCoursesDto.courseIds);
  }
}
