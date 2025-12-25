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
exports.TermController = void 0;
const common_1 = require("@nestjs/common");
const term_service_1 = require("./term.service");
const create_term_dto_1 = require("./dto/create-term.dto");
const update_term_dto_1 = require("./dto/update-term.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let TermController = class TermController {
    termService;
    constructor(termService) {
        this.termService = termService;
    }
    create(levelId, createTermDto) {
        return this.termService.create(levelId, createTermDto);
    }
    findAll(levelId) {
        return this.termService.findAll(levelId);
    }
    findOne(levelId, termId) {
        return this.termService.findOne(levelId, termId);
    }
    update(levelId, termId, updateTermDto) {
        return this.termService.update(levelId, termId, updateTermDto);
    }
    remove(levelId, termId) {
        return this.termService.remove(levelId, termId);
    }
};
exports.TermController = TermController;
__decorate([
    (0, common_1.Post)(':levelId/terms'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new term for a level' }),
    (0, swagger_1.ApiParam)({ name: 'levelId', description: 'ID of the level' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Term created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Level not found.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    __param(0, (0, common_1.Param)('levelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_term_dto_1.CreateTermDto]),
    __metadata("design:returntype", void 0)
], TermController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':levelId/terms'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all terms for a level' }),
    (0, swagger_1.ApiParam)({ name: 'levelId', description: 'ID of the level' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Terms retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Level not found.' }),
    __param(0, (0, common_1.Param)('levelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TermController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':levelId/terms/:termId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific term by ID' }),
    (0, swagger_1.ApiParam)({ name: 'levelId', description: 'ID of the level' }),
    (0, swagger_1.ApiParam)({ name: 'termId', description: 'ID of the term' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Term retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Term or level not found.' }),
    __param(0, (0, common_1.Param)('levelId')),
    __param(1, (0, common_1.Param)('termId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TermController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':levelId/terms/:termId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a term' }),
    (0, swagger_1.ApiParam)({ name: 'levelId', description: 'ID of the level' }),
    (0, swagger_1.ApiParam)({ name: 'termId', description: 'ID of the term' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Term updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Term or level not found.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    __param(0, (0, common_1.Param)('levelId')),
    __param(1, (0, common_1.Param)('termId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_term_dto_1.UpdateTermDto]),
    __metadata("design:returntype", void 0)
], TermController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':levelId/terms/:termId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a term' }),
    (0, swagger_1.ApiParam)({ name: 'levelId', description: 'ID of the level' }),
    (0, swagger_1.ApiParam)({ name: 'termId', description: 'ID of the term' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Term deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Term or level not found.' }),
    __param(0, (0, common_1.Param)('levelId')),
    __param(1, (0, common_1.Param)('termId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TermController.prototype, "remove", null);
exports.TermController = TermController = __decorate([
    (0, swagger_1.ApiTags)('levels'),
    (0, common_1.Controller)('levels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [term_service_1.TermService])
], TermController);
//# sourceMappingURL=term.controller.js.map