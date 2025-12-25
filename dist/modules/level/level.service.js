"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelService = void 0;
const common_1 = require("@nestjs/common");
const level_repository_1 = require("./level.repository");
const organizations_service_1 = require("../organizations/organizations.service");
let LevelService = class LevelService {
    levelRepository;
    organizationsService;
    constructor(levelRepository, organizationsService) {
        this.levelRepository = levelRepository;
        this.organizationsService = organizationsService;
    }
    async create(createLevelDto) {
        await this.organizationsService.findOne(createLevelDto.organizationId);
        const level = await this.levelRepository.create(createLevelDto);
        await this.organizationsService.addLevel(createLevelDto.organizationId, level._id.toString());
        return level;
    }
    findAll() {
        return this.levelRepository.findAll();
    }
    findOne(id) {
        return this.levelRepository.findById(id);
    }
    async findByOrganization(organizationId) {
        await this.organizationsService.findOne(organizationId);
        return this.levelRepository.findByOrganization(organizationId);
    }
    update(id, updateLevelDto) {
        return this.levelRepository.update(id, updateLevelDto);
    }
    remove(id) {
        return this.levelRepository.delete(id);
    }
};
exports.LevelService = LevelService;
exports.LevelService = LevelService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => organizations_service_1.OrganizationsService))),
    __metadata("design:paramtypes", [level_repository_1.LevelRepository,
        organizations_service_1.OrganizationsService])
], LevelService);
//# sourceMappingURL=level.service.js.map