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
exports.DiscountRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const discount_schema_1 = require("./schemas/discount.schema");
let DiscountRepository = class DiscountRepository {
    discountModel;
    constructor(discountModel) {
        this.discountModel = discountModel;
    }
    async create(createDiscountDto) {
        const newDiscount = new this.discountModel(createDiscountDto);
        return newDiscount.save();
    }
    async findAll() {
        return this.discountModel.find().exec();
    }
    async findById(id) {
        return this.discountModel.findById(id).exec();
    }
    async findByCode(code) {
        return this.discountModel.findOne({ code: code.toUpperCase() }).exec();
    }
    async findActiveByCode(code) {
        return this.discountModel
            .findOne({
            code: code.toUpperCase(),
            isActive: true,
        })
            .exec();
    }
    async findByCreator(createdBy, type) {
        const query = { createdBy };
        if (type) {
            query.type = type;
        }
        return this.discountModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async findPlatformWide() {
        return this.discountModel
            .find({ type: discount_schema_1.DiscountType.PLATFORM_WIDE })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findActivePlatformWide() {
        return this.discountModel
            .find({
            type: discount_schema_1.DiscountType.PLATFORM_WIDE,
            isActive: true,
            $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByCourse(courseId) {
        return this.discountModel
            .find({
            type: discount_schema_1.DiscountType.COURSE_SPECIFIC,
            courseId,
            isActive: true,
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    async update(id, updateDiscountDto) {
        return this.discountModel
            .findByIdAndUpdate(id, updateDiscountDto, { new: true })
            .exec();
    }
    async delete(id) {
        return this.discountModel.findByIdAndDelete(id).exec();
    }
};
exports.DiscountRepository = DiscountRepository;
exports.DiscountRepository = DiscountRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(discount_schema_1.Discount.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DiscountRepository);
//# sourceMappingURL=discount.repository.js.map