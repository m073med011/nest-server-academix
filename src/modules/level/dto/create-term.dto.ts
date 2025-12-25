import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTermDto {
  @ApiProperty({ description: 'Name of the term', example: 'Fall 2025' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Description of the term',
    example: 'Fall semester 2025',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Start date of the term', example: '2025-09-01' })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'End date of the term', example: '2025-12-15' })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
