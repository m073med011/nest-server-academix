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
exports.MaterialService = void 0;
const common_1 = require("@nestjs/common");
const material_repository_1 = require("./material.repository");
let MaterialService = class MaterialService {
    materialRepository;
    constructor(materialRepository) {
        this.materialRepository = materialRepository;
    }
    create(createMaterialDto) {
        return this.materialRepository.create(createMaterialDto);
    }
    findAll() {
        return this.materialRepository.findAll();
    }
    findOne(id) {
        return this.materialRepository.findById(id);
    }
    findByCourse(courseId) {
        return this.materialRepository.findByCourse(courseId);
    }
    update(id, updateMaterialDto) {
        return this.materialRepository.update(id, updateMaterialDto);
    }
    remove(id) {
        return this.materialRepository.delete(id);
    }
};
exports.MaterialService = MaterialService;
exports.MaterialService = MaterialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [material_repository_1.MaterialRepository])
], MaterialService);
//# sourceMappingURL=material.service.js.map