import { Model } from 'mongoose';
import { MaterialDocument } from './schemas/material.schema';
export declare class MaterialRepository {
    private materialModel;
    constructor(materialModel: Model<MaterialDocument>);
    create(createMaterialDto: any): Promise<MaterialDocument>;
    findAll(): Promise<MaterialDocument[]>;
    findById(id: string): Promise<MaterialDocument | null>;
    findByCourse(courseId: string): Promise<MaterialDocument[]>;
    update(id: string, updateMaterialDto: any): Promise<MaterialDocument | null>;
    delete(id: string): Promise<MaterialDocument | null>;
}
