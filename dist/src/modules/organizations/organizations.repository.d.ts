import { Model } from 'mongoose';
import { OrganizationDocument } from './schemas/organization.schema';
export declare class OrganizationsRepository {
    private organizationModel;
    constructor(organizationModel: Model<OrganizationDocument>);
    create(createOrganizationDto: any): Promise<OrganizationDocument>;
    findAll(): Promise<OrganizationDocument[]>;
    findById(id: string): Promise<OrganizationDocument | null>;
    update(id: string, updateOrganizationDto: any): Promise<OrganizationDocument | null>;
    delete(id: string): Promise<OrganizationDocument | null>;
}
