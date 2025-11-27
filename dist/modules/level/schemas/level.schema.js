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
exports.LevelSchema = exports.Level = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("../../organizations/schemas/organization.schema");
let Level = class Level {
    name;
    description;
    organizationId;
    order;
};
exports.Level = Level;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 100 }),
    __metadata("design:type", String)
], Level.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ maxlength: 500 }),
    __metadata("design:type", String)
], Level.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    }),
    __metadata("design:type", organization_schema_1.Organization)
], Level.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "order", void 0);
exports.Level = Level = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Level);
exports.LevelSchema = mongoose_1.SchemaFactory.createForClass(Level);
exports.LevelSchema.index({ organizationId: 1, order: 1 });
exports.LevelSchema.index({ organizationId: 1, name: 1 }, { unique: true });
exports.LevelSchema.virtual('terms', {
    ref: 'Term',
    localField: '_id',
    foreignField: 'levelId',
});
exports.LevelSchema.virtual('students', {
    ref: 'OrganizationMembership',
    localField: '_id',
    foreignField: 'levelId',
    match: { status: 'active' },
});
//# sourceMappingURL=level.schema.js.map