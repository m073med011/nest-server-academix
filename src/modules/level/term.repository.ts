import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { Term, TermDocument } from '../organizations/schemas/term.schema';

@Injectable()
export class TermRepository {
  constructor(@InjectModel(Term.name) private termModel: Model<TermDocument>) {}

  async create(term: Partial<Term>): Promise<TermDocument> {
    const newTerm = new this.termModel(term);
    return newTerm.save();
  }

  async findOne(
    filter: FilterQuery<TermDocument>,
  ): Promise<TermDocument | null> {
    return this.termModel.findOne(filter).exec();
  }

  async findById(id: string): Promise<TermDocument | null> {
    return this.termModel.findById(id).exec();
  }

  async find(filter: FilterQuery<TermDocument>): Promise<TermDocument[]> {
    return this.termModel.find(filter).exec();
  }

  async findByLevel(levelId: string): Promise<TermDocument[]> {
    return this.termModel.find({ levelId: new Types.ObjectId(levelId) }).exec();
  }

  async findByOrganization(organizationId: string): Promise<TermDocument[]> {
    return this.termModel
      .find({ organizationId: new Types.ObjectId(organizationId) })
      .exec();
  }

  async update(id: string, data: Partial<Term>): Promise<TermDocument | null> {
    return this.termModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<TermDocument | null> {
    return this.termModel.findByIdAndDelete(id).exec();
  }
}
