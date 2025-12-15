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
exports.MaterialSchema = exports.Material = exports.MaterialType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("../../courses/schemas/course.schema");
var MaterialType;
(function (MaterialType) {
    MaterialType["VIDEO"] = "video";
    MaterialType["PDF"] = "pdf";
    MaterialType["LINK"] = "link";
    MaterialType["TEXT"] = "text";
    MaterialType["QUIZ"] = "quiz";
    MaterialType["ASSIGNMENT"] = "assignment";
})(MaterialType || (exports.MaterialType = MaterialType = {}));
let Material = class Material {
    courseId;
    title;
    description;
    type;
    content;
    url;
    order;
    duration;
    isPublished;
    isFreePreview;
    allowDownloads;
    points;
    dueDate;
    submissionTypes;
    allowLate;
    openInNewTab;
    moduleId;
};
exports.Material = Material;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Course', required: true }),
    __metadata("design:type", course_schema_1.Course)
], Material.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Material.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Material.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: MaterialType }),
    __metadata("design:type", String)
], Material.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Material.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Material.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Material.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Material.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Material.prototype, "isPublished", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Material.prototype, "isFreePreview", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Material.prototype, "allowDownloads", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0 }),
    __metadata("design:type", Number)
], Material.prototype, "points", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Material.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Material.prototype, "submissionTypes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Material.prototype, "allowLate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Material.prototype, "openInNewTab", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Material.prototype, "moduleId", void 0);
exports.Material = Material = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Material);
exports.MaterialSchema = mongoose_1.SchemaFactory.createForClass(Material);
exports.MaterialSchema.index({ courseId: 1, order: 1 });
exports.MaterialSchema.index({ courseId: 1, moduleId: 1, order: 1 });
//# sourceMappingURL=material.schema.js.map