import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  OrganizationRole,
  OrganizationRoleDocument,
} from './schemas/organization-role.schema';

@Injectable()
export class OrganizationRoleRepository {
  constructor(
    @InjectModel(OrganizationRole.name)
    private roleModel: Model<OrganizationRoleDocument>,
  ) {}

  async create(role: any): Promise<OrganizationRoleDocument> {
    const newRole = new this.roleModel(role);
    return newRole.save();
  }

  async findOne(
    filter: FilterQuery<OrganizationRoleDocument>,
  ): Promise<OrganizationRoleDocument | null> {
    return this.roleModel.findOne(filter).exec();
  }

  async findById(id: string): Promise<OrganizationRoleDocument | null> {
    return this.roleModel.findById(id).exec();
  }

  async find(
    filter: FilterQuery<OrganizationRoleDocument>,
  ): Promise<OrganizationRoleDocument[]> {
    return this.roleModel.find(filter).exec();
  }

  async update(
    id: string,
    updateData: Partial<OrganizationRole>,
  ): Promise<OrganizationRoleDocument | null> {
    return this.roleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.roleModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
