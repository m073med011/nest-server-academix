import { MaterialService } from './material.service';
export declare class MaterialController {
    private readonly materialService;
    constructor(materialService: MaterialService);
    create(createMaterialDto: any): Promise<import("./schemas/material.schema").MaterialDocument>;
    findAll(): Promise<import("./schemas/material.schema").MaterialDocument[]>;
    findOne(id: string): Promise<import("./schemas/material.schema").MaterialDocument | null>;
    findByCourse(courseId: string): Promise<import("./schemas/material.schema").MaterialDocument[]>;
    update(id: string, updateMaterialDto: any): Promise<import("./schemas/material.schema").MaterialDocument | null>;
    remove(id: string): Promise<import("./schemas/material.schema").MaterialDocument | null>;
}
