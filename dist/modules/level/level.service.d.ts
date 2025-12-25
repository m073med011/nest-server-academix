import { LevelRepository } from './level.repository';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class LevelService {
    private readonly levelRepository;
    private readonly organizationsService;
    constructor(levelRepository: LevelRepository, organizationsService: OrganizationsService);
    create(createLevelDto: any): Promise<import("./schemas/level.schema").LevelDocument>;
    findAll(): Promise<import("./schemas/level.schema").LevelDocument[]>;
    findOne(id: string): Promise<import("./schemas/level.schema").LevelDocument | null>;
    findByOrganization(organizationId: string): Promise<import("./schemas/level.schema").LevelDocument[]>;
    update(id: string, updateLevelDto: any): Promise<import("./schemas/level.schema").LevelDocument | null>;
    remove(id: string): Promise<import("./schemas/level.schema").LevelDocument | null>;
}
