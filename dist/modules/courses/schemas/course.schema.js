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
exports.CourseSchema = exports.Course = exports.ModuleSchema = exports.Module = exports.ModuleItemSchema = exports.ModuleItem = exports.LessonType = exports.ModuleItemType = exports.CourseType = exports.EnrollmentType = exports.CourseLevel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
var CourseLevel;
(function (CourseLevel) {
    CourseLevel["BEGINNER"] = "beginner";
    CourseLevel["INTERMEDIATE"] = "intermediate";
    CourseLevel["ADVANCED"] = "advanced";
    CourseLevel["EXPERT"] = "expert";
})(CourseLevel || (exports.CourseLevel = CourseLevel = {}));
var EnrollmentType;
(function (EnrollmentType) {
    EnrollmentType["FREE"] = "free";
    EnrollmentType["SUBSCRIPTION"] = "subscription";
    EnrollmentType["ONE_TIME_PURCHASE"] = "one-time-purchase";
    EnrollmentType["ORG_SUBSCRIPTION"] = "org-subscription";
})(EnrollmentType || (exports.EnrollmentType = EnrollmentType = {}));
var CourseType;
(function (CourseType) {
    CourseType["FREELANCING"] = "freelancing";
    CourseType["ORGANIZATION"] = "organization";
})(CourseType || (exports.CourseType = CourseType = {}));
var ModuleItemType;
(function (ModuleItemType) {
    ModuleItemType["LESSON"] = "lesson";
    ModuleItemType["QUIZ"] = "quiz";
    ModuleItemType["FILE"] = "file";
    ModuleItemType["IMAGE"] = "image";
    ModuleItemType["RESOURCE"] = "resource";
    ModuleItemType["ASSIGNMENT"] = "assignment";
})(ModuleItemType || (exports.ModuleItemType = ModuleItemType = {}));
var LessonType;
(function (LessonType) {
    LessonType["TEXT"] = "text";
    LessonType["VIDEO"] = "video";
})(LessonType || (exports.LessonType = LessonType = {}));
let ModuleItem = class ModuleItem {
    materialId;
    order;
};
exports.ModuleItem = ModuleItem;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Material',
        required: true,
    }),
    __metadata("design:type", Object)
], ModuleItem.prototype, "materialId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ModuleItem.prototype, "order", void 0);
exports.ModuleItem = ModuleItem = __decorate([
    (0, mongoose_1.Schema)()
], ModuleItem);
exports.ModuleItemSchema = mongoose_1.SchemaFactory.createForClass(ModuleItem);
let Module = class Module {
    title;
    items;
};
exports.Module = Module;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ModuleItemSchema], default: [] }),
    __metadata("design:type", Array)
], Module.prototype, "items", void 0);
exports.Module = Module = __decorate([
    (0, mongoose_1.Schema)()
], Module);
exports.ModuleSchema = mongoose_1.SchemaFactory.createForClass(Module);
let Course = class Course {
    title;
    description;
    instructor;
    editors;
    price;
    duration;
    level;
    category;
    thumbnailUrl;
    isPublished;
    students;
    rating;
    modules;
    enrollmentType;
    courseType;
    hasAccessRestrictions;
    enrollmentCap;
    organizationId;
    isOrgPrivate;
    termId;
    currency;
    promoVideoUrl;
    brandColor;
    enrollmentStartDate;
    enrollmentEndDate;
};
exports.Course = Course;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 100 }),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, maxlength: 2000 }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_schema_1.User)
], Course.prototype, "instructor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }] }),
    __metadata("design:type", Array)
], Course.prototype, "editors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: CourseLevel, default: CourseLevel.BEGINNER }),
    __metadata("design:type", String)
], Course.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Course.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "isPublished", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }] }),
    __metadata("design:type", Array)
], Course.prototype, "students", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 5, default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ModuleSchema], default: [] }),
    __metadata("design:type", Array)
], Course.prototype, "modules", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: EnrollmentType,
        default: EnrollmentType.FREE,
    }),
    __metadata("design:type", String)
], Course.prototype, "enrollmentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: CourseType, default: CourseType.FREELANCING }),
    __metadata("design:type", String)
], Course.prototype, "courseType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "hasAccessRestrictions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Number)
], Course.prototype, "enrollmentCap", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", Object)
], Course.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "isOrgPrivate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Term' }),
    __metadata("design:type", Object)
], Course.prototype, "termId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'USD' }),
    __metadata("design:type", String)
], Course.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Course.prototype, "promoVideoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#137fec' }),
    __metadata("design:type", String)
], Course.prototype, "brandColor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Course.prototype, "enrollmentStartDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Course.prototype, "enrollmentEndDate", void 0);
exports.Course = Course = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Course);
exports.CourseSchema = mongoose_1.SchemaFactory.createForClass(Course);
exports.CourseSchema.index({ title: 'text', description: 'text' });
exports.CourseSchema.index({ instructor: 1, isPublished: 1 });
exports.CourseSchema.index({ organizationId: 1, isOrgPrivate: 1, isPublished: 1 });
exports.CourseSchema.index({ termId: 1 });
exports.CourseSchema.index({ category: 1 });
exports.CourseSchema.index({ level: 1 });
//# sourceMappingURL=course.schema.js.map