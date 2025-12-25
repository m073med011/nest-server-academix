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

  async findAll(): Promise<OrganizationDocument[]> {
    return this.organizationModel.find().exec();
  }

  async findById(id: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findById(id).exec();
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
