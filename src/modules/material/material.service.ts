import { Injectable } from '@nestjs/common';
import { MaterialRepository } from './material.repository';

@Injectable()
export class MaterialService {
  constructor(private readonly materialRepository: MaterialRepository) {}

  create(createMaterialDto: any) {
    return this.materialRepository.create(createMaterialDto);
  }

  findAll() {
    return this.materialRepository.findAll();
  }

  findOne(id: string) {
    return this.materialRepository.findById(id);
  }

  findByCourse(courseId: string) {
    return this.materialRepository.findByCourse(courseId);
  }

  update(id: string, updateMaterialDto: any) {
    return this.materialRepository.update(id, updateMaterialDto);
  }

  remove(id: string) {
    return this.materialRepository.delete(id);
  }
}
