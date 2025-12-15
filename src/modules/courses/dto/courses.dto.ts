import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  CourseLevel,
  EnrollmentType,
  CourseType,
  ModuleItemType,
  LessonType,
} from '../schemas/course.schema';

export { CourseLevel, EnrollmentType, CourseType, ModuleItemType, LessonType };

export class ModuleItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  materialId: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class ModuleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ type: [ModuleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleItemDto)
  items: ModuleItemDto[];
}

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ enum: CourseLevel })
  @IsNotEmpty()
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  duration: number;

  @ApiProperty({ type: [ModuleDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleDto)
  modules?: ModuleDto[];

  @ApiProperty({ enum: EnrollmentType, required: false })
  @IsOptional()
  @IsEnum(EnrollmentType)
  enrollmentType?: EnrollmentType;

  @ApiProperty({ enum: CourseType, required: false })
  @IsOptional()
  @IsEnum(CourseType)
  courseType?: CourseType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasAccessRestrictions?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  enrollmentCap?: number;

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
  @IsString()
  organizationId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isOrgPrivate?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  promoVideoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brandColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  enrollmentStartDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  enrollmentEndDate?: string;
}

export class UpdateCourseDto {
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

  @ApiProperty({ enum: CourseLevel, required: false })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ type: [ModuleDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleDto)
  modules?: ModuleDto[];

  @ApiProperty({ enum: EnrollmentType, required: false })
  @IsOptional()
  @IsEnum(EnrollmentType)
  enrollmentType?: EnrollmentType;

  @ApiProperty({ enum: CourseType, required: false })
  @IsOptional()
  @IsEnum(CourseType)
  courseType?: CourseType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasAccessRestrictions?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  enrollmentCap?: number;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  promoVideoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brandColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  enrollmentStartDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  enrollmentEndDate?: string;
}

export class CourseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ enum: CourseLevel, required: false })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class AddEditorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  editorId: string;
}
