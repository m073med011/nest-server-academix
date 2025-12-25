import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolePermissions } from '../schemas/organization-role.schema';

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

export class CreateOrganizationCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  level: string; // Enum validation could be added if shared

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isOrgPrivate?: boolean;
}

export class UpdateOrganizationCourseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isOrgPrivate?: boolean;
}

export class AssignTermDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  termId: string;
}

export class OrganizationCourseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  termId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  levelId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instructor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isPublished?: string;
}
