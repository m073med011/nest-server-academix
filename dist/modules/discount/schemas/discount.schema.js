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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountSchema = exports.Discount = exports.ApplicableOn = exports.DiscountValueType = exports.DiscountType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var DiscountType;
(function (DiscountType) {
    DiscountType["PLATFORM_WIDE"] = "platform_wide";
    DiscountType["COURSE_SPECIFIC"] = "course_specific";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
var DiscountValueType;
(function (DiscountValueType) {
    DiscountValueType["PERCENTAGE"] = "percentage";
    DiscountValueType["FIXED"] = "fixed";
})(DiscountValueType || (exports.DiscountValueType = DiscountValueType = {}));
var ApplicableOn;
(function (ApplicableOn) {
    ApplicableOn["SINGLE_ONLY"] = "single_only";
    ApplicableOn["BOTH"] = "both";
})(ApplicableOn || (exports.ApplicableOn = ApplicableOn = {}));
let Discount = class Discount {
    code;
    type;
    createdBy;
    courseId;
    value;
    valueType;
    applicableOn;
    maxUses;
    usedCount;
    isActive;
    expiresAt;
};
exports.Discount = Discount;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    }),
    __metadata("design:type", String)
], Discount.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: DiscountType, index: true }),
    __metadata("design:type", String)
], Discount.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, ref: 'User', required: true, index: true }),
    __metadata("design:type", String)
], Discount.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, ref: 'Course', index: true }),
    __metadata("design:type", String)
], Discount.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Discount.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: DiscountValueType }),
    __metadata("design:type", String)
], Discount.prototype, "valueType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ApplicableOn }),
    __metadata("design:type", String)
], Discount.prototype, "applicableOn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 1 }),
    __metadata("design:type", Number)
], Discount.prototype, "maxUses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], Discount.prototype, "usedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], Discount.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Discount.prototype, "expiresAt", void 0);
exports.Discount = Discount = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'discountcodes' })
], Discount);
exports.DiscountSchema = mongoose_1.SchemaFactory.createForClass(Discount);
exports.DiscountSchema.index({ type: 1, isActive: 1 });
exports.DiscountSchema.index({ courseId: 1, isActive: 1 });
exports.DiscountSchema.index({ code: 1, isActive: 1 });
exports.DiscountSchema.index({ createdBy: 1, type: 1 });
exports.DiscountSchema.index({ expiresAt: 1 });
exports.DiscountSchema.pre('save', function (next) {
    if (this.type === DiscountType.COURSE_SPECIFIC) {
        this.applicableOn = ApplicableOn.SINGLE_ONLY;
    }
    if (this.type === DiscountType.PLATFORM_WIDE && !this.applicableOn) {
        this.applicableOn = ApplicableOn.BOTH;
    }
    next();
});
exports.DiscountSchema.pre('save', function (next) {
    if (this.type === DiscountType.COURSE_SPECIFIC && !this.courseId) {
        next(new Error('courseId is required for COURSE_SPECIFIC discount codes'));
    }
    else if (this.type === DiscountType.PLATFORM_WIDE && this.courseId) {
        this.courseId = undefined;
    }
    next();
});
//# sourceMappingURL=discount.schema.js.map