import { Model } from 'mongoose';
import { LevelDocument } from './schemas/level.schema';
export declare class LevelRepository {
    private levelModel;
    constructor(levelModel: Model<LevelDocument>);
    create(createLevelDto: any): Promise<LevelDocument>;
    findAll(): Promise<LevelDocument[]>;
    findById(id: string): Promise<LevelDocument | null>;
    findByOrganization(organizationId: string): Promise<LevelDocument[]>;
    update(id: string, updateLevelDto: any): Promise<LevelDocument | null>;
    delete(id: string): Promise<LevelDocument | null>;
    addTerm(id: string, termId: string): Promise<LevelDocument | null>;
}
