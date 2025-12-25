import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
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
    const castedMembership = {
      ...membership,
      userId: new Types.ObjectId(membership.userId),
      organizationId: new Types.ObjectId(membership.organizationId),
      roleId: new Types.ObjectId(membership.roleId),
    };

    if (membership.levelId) {
      castedMembership.levelId = new Types.ObjectId(membership.levelId);
    }
    if (membership.termId) {
      castedMembership.termId = new Types.ObjectId(membership.termId);
    }

    const newMembership = new this.membershipModel(castedMembership);
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
