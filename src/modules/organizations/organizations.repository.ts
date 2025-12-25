import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';

@Injectable()
export class OrganizationsRepository {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(createOrganizationDto: any): Promise<OrganizationDocument> {
    const newOrganization = new this.organizationModel(createOrganizationDto);
    return newOrganization.save();
  }

  async findAll(includeDeleted = false): Promise<OrganizationDocument[]> {
    const filter = includeDeleted ? {} : { deletedAt: null };
    return this.organizationModel
      .find(filter)
      .populate('owner', 'name email imageProfileUrl')
      .exec();
  }

  async findById(
    id: string,
    includeDeleted = false,
  ): Promise<OrganizationDocument | null> {
    const filter: any = { _id: id };
    if (!includeDeleted) {
      filter.deletedAt = null;
    }
    return this.organizationModel
      .findOne(filter)
      .populate('owner', 'name email imageProfileUrl')
      .exec();
  }

  async update(
    id: string,
    updateOrganizationDto: any,
  ): Promise<OrganizationDocument | null> {
    return this.organizationModel
      .findByIdAndUpdate(id, updateOrganizationDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findByIdAndDelete(id).exec();
  }

  async findDeleted(): Promise<OrganizationDocument[]> {
    return this.organizationModel.find({ deletedAt: { $ne: null } }).exec();
  }

  async addLevel(
    id: string,
    levelId: string,
  ): Promise<OrganizationDocument | null> {
    return this.organizationModel
      .findByIdAndUpdate(id, { $push: { levels: levelId } }, { new: true })
      .exec();
  }

  async addTerm(
    id: string,
    termId: string,
  ): Promise<OrganizationDocument | null> {
    return this.organizationModel
      .findByIdAndUpdate(id, { $push: { terms: termId } }, { new: true })
      .exec();
  }
}
