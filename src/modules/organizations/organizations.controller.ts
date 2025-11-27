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
  CreateOrganizationCourseDto,
  UpdateOrganizationCourseDto,
  AssignTermDto,
  OrganizationCourseFilterDto,
} from './dto/organizations.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
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
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved.' })
  async findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization retrieved.' })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted.' })
  async remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  // User Management
  @Post('search-user')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search user by email' })
  @ApiResponse({ status: 200, description: 'User found.' })
  async searchUser(@Body() searchUserDto: SearchUserDto) {
    return this.organizationsService.searchUser(searchUserDto.email);
  }

  @Post(':id/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add member to organization' })
  @ApiResponse({ status: 201, description: 'Member added.' })
  async addMember(@Param('id') id: string, @Body() addMemberDto: AddMemberDto) {
    return this.organizationsService.addMember(id, addMemberDto);
  }

  @Delete(':id/members/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove member from organization' })
  @ApiResponse({ status: 200, description: 'Member removed.' })
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.organizationsService.removeMember(id, userId);
  }

  @Get(':id/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization members' })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Members retrieved.' })
  async getMembers(@Param('id') id: string, @Query('status') status?: string) {
    return this.organizationsService.getMembers(id, status);
  }

  @Post(':id/members/leave')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave organization' })
  @ApiResponse({ status: 200, description: 'Left organization.' })
  async leaveMembership(@Param('id') id: string, @Request() req) {
    return this.organizationsService.leaveMembership(id, req.user._id);
  }

  @Get(':id/users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization users by role' })
  @ApiQuery({ name: 'roleId', required: false })
  @ApiResponse({ status: 200, description: 'Users retrieved.' })
  async getOrganizationUsers(
    @Param('id') id: string,
    @Query('roleId') roleId?: string,
  ) {
    return this.organizationsService.getOrganizationUsers(id, roleId);
  }

  @Patch(':id/users/:userId/role')
  @UseGuards(AuthGuard('jwt'))
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

  @Get(':id/users/:userId')
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization roles' })
  @ApiResponse({ status: 200, description: 'Roles retrieved.' })
  async getRoles(@Param('id') id: string) {
    return this.organizationsService.getRoles(id);
  }

  @Post(':id/roles')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete organization role' })
  @ApiResponse({ status: 200, description: 'Role deleted.' })
  async deleteRole(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.organizationsService.deleteRole(id, roleId);
  }

  @Post(':id/invitations/accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept organization invitation' })
  @ApiResponse({ status: 200, description: 'Invitation accepted.' })
  async acceptInvitation(@Param('id') id: string, @Request() req) {
    return this.organizationsService.acceptInvitation(id, req.user._id);
  }

  // Course Management
  @Get(':id/courses')
  @ApiOperation({ summary: 'Get organization courses' })
  @ApiResponse({ status: 200, description: 'Courses retrieved.' })
  async getOrganizationCourses(
    @Param('id') id: string,
    @Query() filterDto: OrganizationCourseFilterDto,
  ) {
    return this.organizationsService.getOrganizationCourses(id, filterDto);
  }

  @Post(':id/courses')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create organization course' })
  @ApiResponse({ status: 201, description: 'Course created.' })
  async createOrganizationCourse(
    @Param('id') id: string,
    @Body() createOrganizationCourseDto: CreateOrganizationCourseDto,
    @Request() req,
  ) {
    return this.organizationsService.createOrganizationCourse(
      id,
      createOrganizationCourseDto,
      req.user._id,
    );
  }

  @Patch(':id/courses/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization course' })
  @ApiResponse({ status: 200, description: 'Course updated.' })
  async updateOrganizationCourse(
    @Param('id') id: string,
    @Param('courseId') courseId: string,
    @Body() updateOrganizationCourseDto: UpdateOrganizationCourseDto,
  ) {
    return this.organizationsService.updateOrganizationCourse(
      id,
      courseId,
      updateOrganizationCourseDto,
    );
  }

  @Delete(':id/courses/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete organization course' })
  @ApiResponse({ status: 200, description: 'Course deleted.' })
  async deleteOrganizationCourse(
    @Param('id') id: string,
    @Param('courseId') courseId: string,
  ) {
    return this.organizationsService.deleteOrganizationCourse(id, courseId);
  }

  @Patch(':id/courses/:courseId/assign-term')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign course to term' })
  @ApiResponse({ status: 200, description: 'Course assigned to term.' })
  async assignCourseToTerm(
    @Param('id') id: string,
    @Param('courseId') courseId: string,
    @Body() assignTermDto: AssignTermDto,
  ) {
    return this.organizationsService.assignCourseToTerm(
      id,
      courseId,
      assignTermDto,
    );
  }
}
