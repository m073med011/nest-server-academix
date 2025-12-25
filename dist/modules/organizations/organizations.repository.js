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
exports.OrganizationsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("./schemas/organization.schema");
let OrganizationsRepository = class OrganizationsRepository {
    organizationModel;
    constructor(organizationModel) {
        this.organizationModel = organizationModel;
    }
    async create(createOrganizationDto) {
        const newOrganization = new this.organizationModel(createOrganizationDto);
        return newOrganization.save();
    }
    async findAll(includeDeleted = false) {
        const filter = includeDeleted ? {} : { deletedAt: null };
        return this.organizationModel
            .find(filter)
            .populate('owner', 'name email imageProfileUrl')
            .exec();
    }
    async findById(id, includeDeleted = false) {
        const filter = { _id: id };
        if (!includeDeleted) {
            filter.deletedAt = null;
        }
        return this.organizationModel
            .findOne(filter)
            .populate('owner', 'name email imageProfileUrl')
            .exec();
    }
    async update(id, updateOrganizationDto) {
        return this.organizationModel
            .findByIdAndUpdate(id, updateOrganizationDto, { new: true })
            .exec();
    }
    async delete(id) {
        return this.organizationModel.findByIdAndDelete(id).exec();
    }
    async findDeleted() {
        return this.organizationModel.find({ deletedAt: { $ne: null } }).exec();
    }
    async addLevel(id, levelId) {
        return this.organizationModel
            .findByIdAndUpdate(id, { $push: { levels: levelId } }, { new: true })
            .exec();
    }
    async addTerm(id, termId) {
        return this.organizationModel
            .findByIdAndUpdate(id, { $push: { terms: termId } }, { new: true })
            .exec();
    }
};
exports.OrganizationsRepository = OrganizationsRepository;
exports.OrganizationsRepository = OrganizationsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrganizationsRepository);
//# sourceMappingURL=organizations.repository.js.map