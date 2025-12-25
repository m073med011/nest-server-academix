import { Model, FilterQuery } from 'mongoose';
import { OrganizationRole, OrganizationRoleDocument } from './schemas/organization-role.schema';
export declare class OrganizationRoleRepository {
    private roleModel;
    constructor(roleModel: Model<OrganizationRoleDocument>);
    create(role: any): Promise<OrganizationRoleDocument>;
    findOne(filter: FilterQuery<OrganizationRoleDocument>): Promise<OrganizationRoleDocument | null>;
    findById(id: string): Promise<OrganizationRoleDocument | null>;
    find(filter: FilterQuery<OrganizationRoleDocument>): Promise<OrganizationRoleDocument[]>;
    update(id: string, updateData: Partial<OrganizationRole>): Promise<OrganizationRoleDocument | null>;
    delete(id: string): Promise<boolean>;
    deleteMany(filter: any): Promise<{
        deletedCount: number;
    }>;
}
