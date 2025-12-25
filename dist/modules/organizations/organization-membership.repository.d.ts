import { Model, FilterQuery } from 'mongoose';
import { OrganizationMembershipDocument } from './schemas/organization-membership.schema';
import { CreateMembershipDto } from './dto/repository.dto';
export declare class OrganizationMembershipRepository {
    private membershipModel;
    constructor(membershipModel: Model<OrganizationMembershipDocument>);
    create(membershipDto: CreateMembershipDto): Promise<OrganizationMembershipDocument>;
    findOne(filter: FilterQuery<OrganizationMembershipDocument>): Promise<OrganizationMembershipDocument | null>;
    find(filter: FilterQuery<OrganizationMembershipDocument>): Promise<OrganizationMembershipDocument[]>;
    findByUser(userId: string): Promise<OrganizationMembershipDocument[]>;
    deleteMany(filter: FilterQuery<OrganizationMembershipDocument>): Promise<{
        deletedCount: number;
    }>;
    count(filter: FilterQuery<OrganizationMembershipDocument>): Promise<number>;
    findPaginated(filter: FilterQuery<OrganizationMembershipDocument>, options: {
        page: number;
        limit: number;
        sort?: any;
        populate?: string | string[];
    }): Promise<{
        data: OrganizationMembershipDocument[];
        total: number;
    }>;
}
