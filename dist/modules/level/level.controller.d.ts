import { LevelService } from './level.service';
export declare class LevelController {
    private readonly levelService;
    constructor(levelService: LevelService);
    create(createLevelDto: any): Promise<import("./schemas/level.schema").LevelDocument>;
    findAll(): Promise<import("./schemas/level.schema").LevelDocument[]>;
    findOne(id: string): Promise<import("./schemas/level.schema").LevelDocument | null>;
    findByOrganization(organizationId: string): Promise<import("./schemas/level.schema").LevelDocument[]>;
    update(id: string, updateLevelDto: any): Promise<import("./schemas/level.schema").LevelDocument | null>;
    remove(id: string): Promise<import("./schemas/level.schema").LevelDocument | null>;
}
