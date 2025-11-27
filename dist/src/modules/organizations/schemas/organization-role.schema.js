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
exports.OrganizationRoleSchema = exports.OrganizationRole = exports.RolePermissions = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let RolePermissions = class RolePermissions {
    canManageOrganization;
    canManageLevels;
    canManageTerms;
    canManageCourses;
    canManageStudents;
    canManageRoles;
    canRecordAttendance;
    canViewReports;
};
exports.RolePermissions = RolePermissions;
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], RolePermissions.prototype, "canManageOrganization", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], RolePermissions.prototype, "canManageLevels", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], RolePermissions.prototype, "canManageTerms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], RolePermissions.prototype, "canManageCourses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], RolePermissions.prototype, "canManageStudents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], RolePermissions.prototype, "canManageRoles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], RolePermissions.prototype, "canRecordAttendance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], RolePermissions.prototype, "canViewReports", void 0);
exports.RolePermissions = RolePermissions = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], RolePermissions);
let OrganizationRole = class OrganizationRole {
    name;
    organizationId;
    permissions;
    isSystemRole;
};
exports.OrganizationRole = OrganizationRole;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 50 }),
    __metadata("design:type", String)
], OrganizationRole.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrganizationRole.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: RolePermissions, default: () => ({}) }),
    __metadata("design:type", RolePermissions)
], OrganizationRole.prototype, "permissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, immutable: true }),
    __metadata("design:type", Boolean)
], OrganizationRole.prototype, "isSystemRole", void 0);
exports.OrganizationRole = OrganizationRole = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], OrganizationRole);
exports.OrganizationRoleSchema = mongoose_1.SchemaFactory.createForClass(OrganizationRole);
exports.OrganizationRoleSchema.index({ organizationId: 1 });
exports.OrganizationRoleSchema.index({ organizationId: 1, name: 1 }, { unique: true });
//# sourceMappingURL=organization-role.schema.js.map