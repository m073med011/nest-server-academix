import { Model, FilterQuery } from 'mongoose';
import { Term, TermDocument } from './schemas/term.schema';
export declare class TermRepository {
    private termModel;
    constructor(termModel: Model<TermDocument>);
    create(term: Partial<Term>): Promise<TermDocument>;
    findOne(filter: FilterQuery<TermDocument>): Promise<TermDocument | null>;
    findById(id: string): Promise<TermDocument | null>;
    find(filter: FilterQuery<TermDocument>): Promise<TermDocument[]>;
    deleteMany(filter: any): Promise<{
        deletedCount: number;
    }>;
}
