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
exports.OrganizationMembershipSchema = exports.OrganizationMembership = exports.MembershipStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var MembershipStatus;
(function (MembershipStatus) {
    MembershipStatus["ACTIVE"] = "active";
    MembershipStatus["INACTIVE"] = "inactive";
    MembershipStatus["LEFT"] = "left";
})(MembershipStatus || (exports.MembershipStatus = MembershipStatus = {}));
let OrganizationMembership = class OrganizationMembership {
    userId;
    organizationId;
    roleId;
    levelId;
    termId;
    status;
    joinedAt;
    leftAt;
};
exports.OrganizationMembership = OrganizationMembership;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrganizationMembership.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrganizationMembership.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'OrganizationRole',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrganizationMembership.prototype, "roleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Level' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrganizationMembership.prototype, "levelId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Term' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrganizationMembership.prototype, "termId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: MembershipStatus,
        default: MembershipStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], OrganizationMembership.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], OrganizationMembership.prototype, "joinedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], OrganizationMembership.prototype, "leftAt", void 0);
exports.OrganizationMembership = OrganizationMembership = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], OrganizationMembership);
exports.OrganizationMembershipSchema = mongoose_1.SchemaFactory.createForClass(OrganizationMembership);
exports.OrganizationMembershipSchema.index({ userId: 1, organizationId: 1 });
exports.OrganizationMembershipSchema.index({ organizationId: 1, status: 1 });
exports.OrganizationMembershipSchema.index({ levelId: 1, status: 1 });
exports.OrganizationMembershipSchema.index({ termId: 1 });
exports.OrganizationMembershipSchema.index({ userId: 1, organizationId: 1, status: 1 }, {
    unique: true,
    partialFilterExpression: { status: MembershipStatus.ACTIVE },
});
exports.OrganizationMembershipSchema.index({
    organizationId: 1,
    status: 1,
    roleId: 1,
});
exports.OrganizationMembershipSchema.index({
    userId: 1,
    status: 1,
});
exports.OrganizationMembershipSchema.index({
    organizationId: 1,
    joinedAt: 1,
});
exports.OrganizationMembershipSchema.index({
    organizationId: 1,
    leftAt: 1,
});
exports.OrganizationMembershipSchema.index({
    organizationId: 1,
    status: 1,
    joinedAt: -1,
});
//# sourceMappingURL=organization-membership.schema.js.map