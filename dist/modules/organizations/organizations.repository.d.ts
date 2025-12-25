import { Model } from 'mongoose';
import { OrganizationDocument } from './schemas/organization.schema';
export declare class OrganizationsRepository {
    private organizationModel;
    constructor(organizationModel: Model<OrganizationDocument>);
    create(createOrganizationDto: any): Promise<OrganizationDocument>;
    findAll(includeDeleted?: boolean): Promise<OrganizationDocument[]>;
    findById(id: string, includeDeleted?: boolean): Promise<OrganizationDocument | null>;
    update(id: string, updateOrganizationDto: any): Promise<OrganizationDocument | null>;
    delete(id: string): Promise<OrganizationDocument | null>;
    findDeleted(): Promise<OrganizationDocument[]>;
    addLevel(id: string, levelId: string): Promise<OrganizationDocument | null>;
    addTerm(id: string, termId: string): Promise<OrganizationDocument | null>;
}
