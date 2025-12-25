import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TermService } from './term.service';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('levels')
@Controller('levels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TermController {
  constructor(private readonly termService: TermService) {}

  @Post(':levelId/terms')
  @ApiOperation({ summary: 'Create a new term for a level' })
  @ApiParam({ name: 'levelId', description: 'ID of the level' })
  @ApiResponse({ status: 201, description: 'Term created successfully.' })
  @ApiResponse({ status: 404, description: 'Level not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(
    @Param('levelId') levelId: string,
    @Body() createTermDto: CreateTermDto,
  ) {
    return this.termService.create(levelId, createTermDto);
  }

  @Get(':levelId/terms')
  @ApiOperation({ summary: 'Get all terms for a level' })
  @ApiParam({ name: 'levelId', description: 'ID of the level' })
  @ApiResponse({ status: 200, description: 'Terms retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Level not found.' })
  findAll(@Param('levelId') levelId: string) {
    return this.termService.findAll(levelId);
  }

  @Get(':levelId/terms/:termId')
  @ApiOperation({ summary: 'Get a specific term by ID' })
  @ApiParam({ name: 'levelId', description: 'ID of the level' })
  @ApiParam({ name: 'termId', description: 'ID of the term' })
  @ApiResponse({ status: 200, description: 'Term retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Term or level not found.' })
  findOne(
    @Param('levelId') levelId: string,
    @Param('termId') termId: string,
  ) {
    return this.termService.findOne(levelId, termId);
  }

  @Patch(':levelId/terms/:termId')
  @ApiOperation({ summary: 'Update a term' })
  @ApiParam({ name: 'levelId', description: 'ID of the level' })
  @ApiParam({ name: 'termId', description: 'ID of the term' })
  @ApiResponse({ status: 200, description: 'Term updated successfully.' })
  @ApiResponse({ status: 404, description: 'Term or level not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('levelId') levelId: string,
    @Param('termId') termId: string,
    @Body() updateTermDto: UpdateTermDto,
  ) {
    return this.termService.update(levelId, termId, updateTermDto);
  }

  @Delete(':levelId/terms/:termId')
  @ApiOperation({ summary: 'Delete a term' })
  @ApiParam({ name: 'levelId', description: 'ID of the level' })
  @ApiParam({ name: 'termId', description: 'ID of the term' })
  @ApiResponse({ status: 200, description: 'Term deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Term or level not found.' })
  remove(
    @Param('levelId') levelId: string,
    @Param('termId') termId: string,
  ) {
    return this.termService.remove(levelId, termId);
  }
}
