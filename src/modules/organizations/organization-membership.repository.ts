import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import {
  OrganizationMembership,
  OrganizationMembershipDocument,
} from './schemas/organization-membership.schema';
import { CreateMembershipDto } from './dto/repository.dto';

@Injectable()
export class OrganizationMembershipRepository {
  constructor(
    @InjectModel(OrganizationMembership.name)
    private membershipModel: Model<OrganizationMembershipDocument>,
  ) {}

  async create(
    membershipDto: CreateMembershipDto,
  ): Promise<OrganizationMembershipDocument> {
    const castedMembership: any = {
      ...membershipDto,
      userId: new Types.ObjectId(membershipDto.userId.toString()),
      organizationId: new Types.ObjectId(membershipDto.organizationId.toString()),
      roleId: new Types.ObjectId(membershipDto.roleId.toString()),
    };

    if (membershipDto.levelId) {
      castedMembership.levelId = new Types.ObjectId(
        membershipDto.levelId.toString(),
      );
    }
    if (membershipDto.termId) {
      castedMembership.termId = new Types.ObjectId(
        membershipDto.termId.toString(),
      );
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
      .populate({
        path: 'organizationId',
        populate: {
          path: 'owner',
          select: 'name email imageProfileUrl',
        },
      })
      .populate('roleId')
      .exec();
  }

  async deleteMany(
    filter: FilterQuery<OrganizationMembershipDocument>,
  ): Promise<{ deletedCount: number }> {
    const result = await this.membershipModel.deleteMany(filter).exec();
    return { deletedCount: result.deletedCount || 0 };
  }

  async count(
    filter: FilterQuery<OrganizationMembershipDocument>,
  ): Promise<number> {
    return this.membershipModel.countDocuments(filter).exec();
  }

  async findPaginated(
    filter: FilterQuery<OrganizationMembershipDocument>,
    options: {
      page: number;
      limit: number;
      sort?: any;
      populate?: string | string[];
    },
  ): Promise<{
    data: OrganizationMembershipDocument[];
    total: number;
  }> {
    const { page, limit, sort = { joinedAt: -1 }, populate } = options;
    const skip = (page - 1) * limit;

    let query = this.membershipModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((field) => {
          query = query.populate(field);
        });
      } else {
        query = query.populate(populate);
      }
    }

    const [data, total] = await Promise.all([
      query.exec(),
      this.membershipModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }
}
