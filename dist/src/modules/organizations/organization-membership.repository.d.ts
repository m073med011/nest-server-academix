import { Model, FilterQuery } from 'mongoose';
import { OrganizationMembershipDocument } from './schemas/organization-membership.schema';
export declare class OrganizationMembershipRepository {
    private membershipModel;
    constructor(membershipModel: Model<OrganizationMembershipDocument>);
    create(membership: any): Promise<OrganizationMembershipDocument>;
    findOne(filter: FilterQuery<OrganizationMembershipDocument>): Promise<OrganizationMembershipDocument | null>;
    find(filter: FilterQuery<OrganizationMembershipDocument>): Promise<OrganizationMembershipDocument[]>;
    findByUser(userId: string): Promise<OrganizationMembershipDocument[]>;
}
