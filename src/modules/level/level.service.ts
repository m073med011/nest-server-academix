import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { LevelRepository } from './level.repository';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class LevelService {
  constructor(
    private readonly levelRepository: LevelRepository,
    @Inject(forwardRef(() => OrganizationsService))
    private readonly organizationsService: OrganizationsService,
  ) {}

  async create(createLevelDto: any) {
    // Validate organization exists before creating level
    await this.organizationsService.findOne(createLevelDto.organizationId);
    const level = await this.levelRepository.create(createLevelDto);
    await this.organizationsService.addLevel(
      createLevelDto.organizationId,
      level._id.toString(),
    );
    return level;
  }

  findAll() {
    return this.levelRepository.findAll();
  }

  findOne(id: string) {
    return this.levelRepository.findById(id);
  }

  async findByOrganization(organizationId: string) {
    // Validate organization exists before querying levels
    await this.organizationsService.findOne(organizationId);
    return this.levelRepository.findByOrganization(organizationId);
  }

  update(id: string, updateLevelDto: any) {
    return this.levelRepository.update(id, updateLevelDto);
  }

  remove(id: string) {
    return this.levelRepository.delete(id);
  }
}
