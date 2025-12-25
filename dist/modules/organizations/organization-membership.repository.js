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
exports.OrganizationMembershipRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_membership_schema_1 = require("./schemas/organization-membership.schema");
let OrganizationMembershipRepository = class OrganizationMembershipRepository {
    membershipModel;
    constructor(membershipModel) {
        this.membershipModel = membershipModel;
    }
    async create(membershipDto) {
        const castedMembership = {
            ...membershipDto,
            userId: new mongoose_2.Types.ObjectId(membershipDto.userId.toString()),
            organizationId: new mongoose_2.Types.ObjectId(membershipDto.organizationId.toString()),
            roleId: new mongoose_2.Types.ObjectId(membershipDto.roleId.toString()),
        };
        if (membershipDto.levelId) {
            castedMembership.levelId = new mongoose_2.Types.ObjectId(membershipDto.levelId.toString());
        }
        if (membershipDto.termId) {
            castedMembership.termId = new mongoose_2.Types.ObjectId(membershipDto.termId.toString());
        }
        const newMembership = new this.membershipModel(castedMembership);
        return newMembership.save();
    }
    async findOne(filter) {
        return this.membershipModel.findOne(filter).exec();
    }
    async find(filter) {
        return this.membershipModel.find(filter).exec();
    }
    async findByUser(userId) {
        return this.membershipModel
            .find({ userId, status: 'active' })
            .populate({
            path: 'organizationId',
            populate: {
                path: 'owner',
                select: 'name email imageProfileUrl',
            },
        })
            .populate('roleId')
            .exec();
    }
    async deleteMany(filter) {
        const result = await this.membershipModel.deleteMany(filter).exec();
        return { deletedCount: result.deletedCount || 0 };
    }
    async count(filter) {
        return this.membershipModel.countDocuments(filter).exec();
    }
    async findPaginated(filter, options) {
        const { page, limit, sort = { joinedAt: -1 }, populate } = options;
        const skip = (page - 1) * limit;
        let query = this.membershipModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort);
        if (populate) {
            if (Array.isArray(populate)) {
                populate.forEach((field) => {
                    query = query.populate(field);
                });
            }
            else {
                query = query.populate(populate);
            }
        }
        const [data, total] = await Promise.all([
            query.exec(),
            this.membershipModel.countDocuments(filter).exec(),
        ]);
        return { data, total };
    }
};
exports.OrganizationMembershipRepository = OrganizationMembershipRepository;
exports.OrganizationMembershipRepository = OrganizationMembershipRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_membership_schema_1.OrganizationMembership.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrganizationMembershipRepository);
//# sourceMappingURL=organization-membership.repository.js.map