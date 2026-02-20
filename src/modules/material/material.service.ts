import { Injectable } from '@nestjs/common';
import { MaterialRepository } from './material.repository';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialService {
  constructor(private readonly materialRepository: MaterialRepository) {}

  create(createMaterialDto: CreateMaterialDto) {
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

  update(id: string, updateMaterialDto: UpdateMaterialDto) {
    return this.materialRepository.update(id, updateMaterialDto);
  }

  remove(id: string) {
    return this.materialRepository.delete(id);
  }
}
