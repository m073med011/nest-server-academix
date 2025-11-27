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
exports.TermSchema = exports.Term = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Term = class Term {
    name;
    description;
    levelId;
    organizationId;
    startDate;
    endDate;
};
exports.Term = Term;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 100 }),
    __metadata("design:type", String)
], Term.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ maxlength: 500 }),
    __metadata("design:type", String)
], Term.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Level', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Term.prototype, "levelId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Term.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Term.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Term.prototype, "endDate", void 0);
exports.Term = Term = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Term);
exports.TermSchema = mongoose_1.SchemaFactory.createForClass(Term);
exports.TermSchema.index({ levelId: 1 });
exports.TermSchema.index({ organizationId: 1 });
exports.TermSchema.index({ levelId: 1, startDate: 1 });
exports.TermSchema.pre('save', function (next) {
    if (this.endDate <= this.startDate) {
        const err = new Error('End date must be after start date');
        return next(err);
    }
    next();
});
exports.TermSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'termId',
});
//# sourceMappingURL=term.schema.js.map