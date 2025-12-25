import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { TermRepository } from './term.repository';
import { LevelRepository } from './level.repository';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { Types } from 'mongoose';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class TermService {
  constructor(
    private readonly termRepository: TermRepository,
    private readonly levelRepository: LevelRepository,
    @Inject(forwardRef(() => OrganizationsService))
    private readonly organizationsService: OrganizationsService,
  ) {}

  async create(levelId: string, createTermDto: CreateTermDto) {
    // Validate that the level exists and get its organizationId
    const level = await this.levelRepository.findById(levelId);
    if (!level) {
      throw new NotFoundException(`Level with ID ${levelId} not found`);
    }

    // Validate dates
    const startDate = new Date(createTermDto.startDate);
    const endDate = new Date(createTermDto.endDate);
    
    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Create term with levelId and organizationId
    const term = await this.termRepository.create({
      ...createTermDto,
      levelId: new Types.ObjectId(levelId),
      organizationId: new Types.ObjectId(level.organizationId.toString()),
    });

    await this.levelRepository.addTerm(levelId, term._id.toString());
    await this.organizationsService.addTerm(
      level.organizationId.toString(),
      term._id.toString(),
    );

    return term;
  }

  async findAll(levelId: string) {
    // Validate that the level exists
    const level = await this.levelRepository.findById(levelId);
    if (!level) {
      throw new NotFoundException(`Level with ID ${levelId} not found`);
    }

    return this.termRepository.findByLevel(levelId);
  }

  async findOne(levelId: string, termId: string) {
    const term = await this.termRepository.findById(termId);
    
    if (!term) {
      throw new NotFoundException(`Term with ID ${termId} not found`);
    }

    // Verify that the term belongs to the specified level
    if (term.levelId.toString() !== levelId) {
      throw new NotFoundException(`Term with ID ${termId} not found in level ${levelId}`);
    }

    return term;
  }

  async update(levelId: string, termId: string, updateTermDto: UpdateTermDto) {
    // First verify the term exists and belongs to this level
    await this.findOne(levelId, termId);

    // Validate dates if both are being updated
    if (updateTermDto.startDate && updateTermDto.endDate) {
      const startDate = new Date(updateTermDto.startDate);
      const endDate = new Date(updateTermDto.endDate);
      
      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    const updatedTerm = await this.termRepository.update(termId, updateTermDto);
    
    if (!updatedTerm) {
      throw new NotFoundException(`Term with ID ${termId} not found`);
    }

    return updatedTerm;
  }

  async remove(levelId: string, termId: string) {
    // First verify the term exists and belongs to this level
    await this.findOne(levelId, termId);

    const deletedTerm = await this.termRepository.delete(termId);
    
    if (!deletedTerm) {
      throw new NotFoundException(`Term with ID ${termId} not found`);
    }

    return deletedTerm;
  }
}
