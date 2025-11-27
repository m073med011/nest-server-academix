import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  SwitchContextDto,
} from './dto/users.dto';
import { Response } from 'express';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search users by email' })
  @ApiQuery({ name: 'email', required: true })
  @ApiResponse({ status: 200, description: 'Users found.' })
  async searchUsers(@Query('email') email: string, @Request() req) {
    return this.usersService.searchUsers(email, req.user._id);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved.' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user._id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated.' })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user._id, updateProfileDto);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password changed.' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(req.user._id, changePasswordDto);
  }

  @Get('organizations')
  @ApiOperation({ summary: 'Get user organizations' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved.' })
  async getMyOrganizations(@Request() req) {
    return this.usersService.getMyOrganizations(req.user._id);
  }

  @Post('switch-context')
  @ApiOperation({ summary: 'Switch active organization context' })
  @ApiResponse({ status: 200, description: 'Context switched.' })
  async switchContext(
    @Request() req,
    @Body() switchContextDto: SwitchContextDto,
  ) {
    return this.usersService.switchContext(req.user._id, switchContextDto);
  }
}
