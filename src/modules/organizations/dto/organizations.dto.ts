import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RolePermissions } from '../schemas/organization-role.schema';
import { MembershipStatus } from '../schemas/organization-membership.schema';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number (1-based)',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 50,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}

export class GetMembersDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter by membership status',
    enum: MembershipStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MembershipStatus)
  status?: MembershipStatus;

  @ApiProperty({
    description: 'Filter by role ID',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  roleId?: string;

  @ApiProperty({
    description: 'Filter by level ID',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  levelId?: string;

  @ApiProperty({
    description: 'Filter by term ID',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  termId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class CreateOrganizationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orgcover?: string;
}

export class UpdateOrganizationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orgcover?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  settings?: any;
}

export class SearchUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class AddMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  levelId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  termId?: string;
}

export class UpdateMemberRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  levelId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  termId?: string;
}

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: RolePermissions })
  @IsOptional()
  permissions?: RolePermissions;
}

export class UpdateRoleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: RolePermissions, required: false })
  @IsOptional()
  permissions?: RolePermissions;
}

export class AddCoursesDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  courseIds: string[];
}
