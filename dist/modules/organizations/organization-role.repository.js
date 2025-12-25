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
exports.OrganizationRoleRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_role_schema_1 = require("./schemas/organization-role.schema");
let OrganizationRoleRepository = class OrganizationRoleRepository {
    roleModel;
    constructor(roleModel) {
        this.roleModel = roleModel;
    }
    async create(role) {
        const newRole = new this.roleModel(role);
        return newRole.save();
    }
    async findOne(filter) {
        return this.roleModel.findOne(filter).exec();
    }
    async findById(id) {
        return this.roleModel.findById(id).exec();
    }
    async find(filter) {
        return this.roleModel.find(filter).exec();
    }
    async update(id, updateData) {
        return this.roleModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
    }
    async delete(id) {
        const result = await this.roleModel.findByIdAndDelete(id).exec();
        return !!result;
    }
    async deleteMany(filter) {
        const result = await this.roleModel.deleteMany(filter).exec();
        return { deletedCount: result.deletedCount || 0 };
    }
};
exports.OrganizationRoleRepository = OrganizationRoleRepository;
exports.OrganizationRoleRepository = OrganizationRoleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_role_schema_1.OrganizationRole.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrganizationRoleRepository);
//# sourceMappingURL=organization-role.repository.js.map