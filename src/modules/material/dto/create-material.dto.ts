import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaterialType } from '../schemas/material.schema';

class QuizQuestionDto {
  @IsString()
  text: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsString()
  correctAnswer: string;
}

export class CreateMaterialDto {
  @IsString()
  courseId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(MaterialType)
  type: MaterialType;

  @IsString()
  @IsOptional()
  moduleId?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  // Content for Article or general text
  @IsString()
  @IsOptional()
  content?: string;

  // URL for Video or External Link
  @IsString()
  @IsOptional()
  url?: string;

  // Video/Article Fields
  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number; // Read time for article

  @IsBoolean()
  @IsOptional()
  isFreePreview?: boolean;

  @IsBoolean()
  @IsOptional()
  allowDownloads?: boolean;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  // Assignment Fields
  @IsNumber()
  @Min(0)
  @IsOptional()
  points?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  submissionTypes?: string[];

  @IsBoolean()
  @IsOptional()
  allowLate?: boolean;

  @IsString()
  @IsOptional()
  assignmentFileUrl?: string;

  // Quiz Fields
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  @IsOptional()
  quizQuestions?: QuizQuestionDto[];

  // Link Fields
  @IsBoolean()
  @IsOptional()
  openInNewTab?: boolean;
}
