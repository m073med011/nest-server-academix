import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  OrganizationMembership,
  OrganizationMembershipDocument,
} from './schemas/organization-membership.schema';

@Injectable()
export class OrganizationMembershipRepository {
  constructor(
    @InjectModel(OrganizationMembership.name)
    private membershipModel: Model<OrganizationMembershipDocument>,
  ) {}

  async create(membership: any): Promise<OrganizationMembershipDocument> {
    const newMembership = new this.membershipModel(membership);
    return newMembership.save();
  }

  async findOne(
    filter: FilterQuery<OrganizationMembershipDocument>,
  ): Promise<OrganizationMembershipDocument | null> {
    return this.membershipModel.findOne(filter).exec();
  }

  async find(
    filter: FilterQuery<OrganizationMembershipDocument>,
  ): Promise<OrganizationMembershipDocument[]> {
    return this.membershipModel.find(filter).exec();
  }

  async findByUser(userId: string): Promise<OrganizationMembershipDocument[]> {
    return this.membershipModel
      .find({ userId, status: 'active' })
      .populate('organizationId')
      .populate('roleId')
      .exec();
  }
}
