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
exports.OrganizationSchema = exports.Organization = exports.OrganizationSettings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let OrganizationSettings = class OrganizationSettings {
    allowMultipleLevels;
    requireTermAssignment;
    allowStudentSelfEnroll;
};
exports.OrganizationSettings = OrganizationSettings;
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], OrganizationSettings.prototype, "allowMultipleLevels", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], OrganizationSettings.prototype, "requireTermAssignment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], OrganizationSettings.prototype, "allowStudentSelfEnroll", void 0);
exports.OrganizationSettings = OrganizationSettings = __decorate([
    (0, mongoose_1.Schema)()
], OrganizationSettings);
let Organization = class Organization {
    name;
    description;
    owner;
    settings;
};
exports.Organization = Organization;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 100 }),
    __metadata("design:type", String)
], Organization.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ maxlength: 1000 }),
    __metadata("design:type", String)
], Organization.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true,
    }),
    __metadata("design:type", user_schema_1.User)
], Organization.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: OrganizationSettings, default: () => ({}) }),
    __metadata("design:type", OrganizationSettings)
], Organization.prototype, "settings", void 0);
exports.Organization = Organization = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Organization);
exports.OrganizationSchema = mongoose_1.SchemaFactory.createForClass(Organization);
exports.OrganizationSchema.index({ owner: 1 });
exports.OrganizationSchema.index({ name: 1 });
exports.OrganizationSchema.virtual('members', {
    ref: 'OrganizationMembership',
    localField: '_id',
    foreignField: 'organizationId',
});
exports.OrganizationSchema.virtual('levels', {
    ref: 'Level',
    localField: '_id',
    foreignField: 'organizationId',
});
//# sourceMappingURL=organization.schema.js.map