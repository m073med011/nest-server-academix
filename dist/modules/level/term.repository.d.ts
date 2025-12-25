import { Model, FilterQuery } from 'mongoose';
import { Term, TermDocument } from '../organizations/schemas/term.schema';
export declare class TermRepository {
    private termModel;
    constructor(termModel: Model<TermDocument>);
    create(term: Partial<Term>): Promise<TermDocument>;
    findOne(filter: FilterQuery<TermDocument>): Promise<TermDocument | null>;
    findById(id: string): Promise<TermDocument | null>;
    find(filter: FilterQuery<TermDocument>): Promise<TermDocument[]>;
    findByLevel(levelId: string): Promise<TermDocument[]>;
    findByOrganization(organizationId: string): Promise<TermDocument[]>;
    update(id: string, data: Partial<Term>): Promise<TermDocument | null>;
    delete(id: string): Promise<TermDocument | null>;
}
