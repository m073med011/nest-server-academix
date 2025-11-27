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
} from '@nestjs/common';
import { LevelService } from './level.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('levels')
@UseGuards(JwtAuthGuard)
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  create(@Body() createLevelDto: any) {
    return this.levelService.create(createLevelDto);
  }

  @Get()
  findAll() {
    return this.levelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(id);
  }

  @Get('organization/:organizationId')
  findByOrganization(@Param('organizationId') organizationId: string) {
    return this.levelService.findByOrganization(organizationId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelDto: any) {
    return this.levelService.update(id, updateLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelService.remove(id);
  }
}
