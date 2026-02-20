import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
export declare class MaterialController {
    private readonly materialService;
    constructor(materialService: MaterialService);
    create(createMaterialDto: CreateMaterialDto): Promise<import("./schemas/material.schema").MaterialDocument>;
    findAll(): Promise<import("./schemas/material.schema").MaterialDocument[]>;
    findOne(id: string): Promise<import("./schemas/material.schema").MaterialDocument | null>;
    findByCourse(courseId: string): Promise<import("./schemas/material.schema").MaterialDocument[]>;
    update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<import("./schemas/material.schema").MaterialDocument | null>;
    remove(id: string): Promise<import("./schemas/material.schema").MaterialDocument | null>;
}
