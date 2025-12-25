import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level, LevelDocument } from './schemas/level.schema';

@Injectable()
export class LevelRepository {
  constructor(
    @InjectModel(Level.name) private levelModel: Model<LevelDocument>,
  ) {}

  async create(createLevelDto: any): Promise<LevelDocument> {
    const newLevel = new this.levelModel(createLevelDto);
    return newLevel.save();
  }

  async findAll(): Promise<LevelDocument[]> {
    return this.levelModel.find().exec();
  }

  async findById(id: string): Promise<LevelDocument | null> {
    return this.levelModel.findById(id).exec();
  }

  async findByOrganization(organizationId: string): Promise<LevelDocument[]> {
    return this.levelModel.find({ organizationId }).sort({ order: 1 }).exec();
  }

  async update(id: string, updateLevelDto: any): Promise<LevelDocument | null> {
    return this.levelModel
      .findByIdAndUpdate(id, updateLevelDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<LevelDocument | null> {
    return this.levelModel.findByIdAndDelete(id).exec();
  }

  async addTerm(id: string, termId: string): Promise<LevelDocument | null> {
    return this.levelModel
      .findByIdAndUpdate(id, { $push: { terms: termId } }, { new: true })
      .exec();
  }
}
