import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Material, MaterialDocument } from './schemas/material.schema';

@Injectable()
export class MaterialRepository {
  constructor(
    @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
  ) {}

  async create(createMaterialDto: any): Promise<MaterialDocument> {
    const newMaterial = new this.materialModel(createMaterialDto);
    return newMaterial.save();
  }

  async findAll(): Promise<MaterialDocument[]> {
    return this.materialModel.find().exec();
  }

  async findById(id: string): Promise<MaterialDocument | null> {
    return this.materialModel.findById(id).exec();
  }

  async findByCourse(courseId: string): Promise<MaterialDocument[]> {
    return this.materialModel.find({ courseId }).sort({ order: 1 }).exec();
  }

  async update(
    id: string,
    updateMaterialDto: any,
  ): Promise<MaterialDocument | null> {
    return this.materialModel
      .findByIdAndUpdate(id, updateMaterialDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<MaterialDocument | null> {
    return this.materialModel.findByIdAndDelete(id).exec();
  }
}
