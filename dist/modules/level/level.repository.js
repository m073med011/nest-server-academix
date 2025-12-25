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
exports.LevelRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const level_schema_1 = require("./schemas/level.schema");
let LevelRepository = class LevelRepository {
    levelModel;
    constructor(levelModel) {
        this.levelModel = levelModel;
    }
    async create(createLevelDto) {
        const newLevel = new this.levelModel(createLevelDto);
        return newLevel.save();
    }
    async findAll() {
        return this.levelModel.find().exec();
    }
    async findById(id) {
        return this.levelModel.findById(id).exec();
    }
    async findByOrganization(organizationId) {
        return this.levelModel.find({ organizationId }).sort({ order: 1 }).exec();
    }
    async update(id, updateLevelDto) {
        return this.levelModel
            .findByIdAndUpdate(id, updateLevelDto, { new: true })
            .exec();
    }
    async delete(id) {
        return this.levelModel.findByIdAndDelete(id).exec();
    }
    async addTerm(id, termId) {
        return this.levelModel
            .findByIdAndUpdate(id, { $push: { terms: termId } }, { new: true })
            .exec();
    }
};
exports.LevelRepository = LevelRepository;
exports.LevelRepository = LevelRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(level_schema_1.Level.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LevelRepository);
//# sourceMappingURL=level.repository.js.map