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
exports.TermService = void 0;
const common_1 = require("@nestjs/common");
const term_repository_1 = require("./term.repository");
const level_repository_1 = require("./level.repository");
const mongoose_1 = require("mongoose");
const organizations_service_1 = require("../organizations/organizations.service");
let TermService = class TermService {
    termRepository;
    levelRepository;
    organizationsService;
    constructor(termRepository, levelRepository, organizationsService) {
        this.termRepository = termRepository;
        this.levelRepository = levelRepository;
        this.organizationsService = organizationsService;
    }
    async create(levelId, createTermDto) {
        const level = await this.levelRepository.findById(levelId);
        if (!level) {
            throw new common_1.NotFoundException(`Level with ID ${levelId} not found`);
        }
        const startDate = new Date(createTermDto.startDate);
        const endDate = new Date(createTermDto.endDate);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const term = await this.termRepository.create({
            ...createTermDto,
            levelId: new mongoose_1.Types.ObjectId(levelId),
            organizationId: new mongoose_1.Types.ObjectId(level.organizationId.toString()),
        });
        await this.levelRepository.addTerm(levelId, term._id.toString());
        await this.organizationsService.addTerm(level.organizationId.toString(), term._id.toString());
        return term;
    }
    async findAll(levelId) {
        const level = await this.levelRepository.findById(levelId);
        if (!level) {
            throw new common_1.NotFoundException(`Level with ID ${levelId} not found`);
        }
        return this.termRepository.findByLevel(levelId);
    }
    async findOne(levelId, termId) {
        const term = await this.termRepository.findById(termId);
        if (!term) {
            throw new common_1.NotFoundException(`Term with ID ${termId} not found`);
        }
        if (term.levelId.toString() !== levelId) {
            throw new common_1.NotFoundException(`Term with ID ${termId} not found in level ${levelId}`);
        }
        return term;
    }
    async update(levelId, termId, updateTermDto) {
        await this.findOne(levelId, termId);
        if (updateTermDto.startDate && updateTermDto.endDate) {
            const startDate = new Date(updateTermDto.startDate);
            const endDate = new Date(updateTermDto.endDate);
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        const updatedTerm = await this.termRepository.update(termId, updateTermDto);
        if (!updatedTerm) {
            throw new common_1.NotFoundException(`Term with ID ${termId} not found`);
        }
        return updatedTerm;
    }
    async remove(levelId, termId) {
        await this.findOne(levelId, termId);
        const deletedTerm = await this.termRepository.delete(termId);
        if (!deletedTerm) {
            throw new common_1.NotFoundException(`Term with ID ${termId} not found`);
        }
        return deletedTerm;
    }
};
exports.TermService = TermService;
exports.TermService = TermService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => organizations_service_1.OrganizationsService))),
    __metadata("design:paramtypes", [term_repository_1.TermRepository,
        level_repository_1.LevelRepository,
        organizations_service_1.OrganizationsService])
], TermService);
//# sourceMappingURL=term.service.js.map