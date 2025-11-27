import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Term, TermDocument } from './schemas/term.schema';

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
}
