import { Injectable } from '@nestjs/common';
import { LevelRepository } from './level.repository';

@Injectable()
export class LevelService {
  constructor(private readonly levelRepository: LevelRepository) {}

  create(createLevelDto: any) {
    return this.levelRepository.create(createLevelDto);
  }

  findAll() {
    return this.levelRepository.findAll();
  }

  findOne(id: string) {
    return this.levelRepository.findById(id);
  }

  findByOrganization(organizationId: string) {
    return this.levelRepository.findByOrganization(organizationId);
  }

  update(id: string, updateLevelDto: any) {
    return this.levelRepository.update(id, updateLevelDto);
  }

  remove(id: string) {
    return this.levelRepository.delete(id);
  }
}
