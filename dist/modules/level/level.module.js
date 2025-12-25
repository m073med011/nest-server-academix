"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const level_controller_1 = require("./level.controller");
const level_service_1 = require("./level.service");
const level_repository_1 = require("./level.repository");
const level_schema_1 = require("./schemas/level.schema");
const term_schema_1 = require("../organizations/schemas/term.schema");
const term_controller_1 = require("./term.controller");
const term_service_1 = require("./term.service");
const term_repository_1 = require("./term.repository");
const organizations_module_1 = require("../organizations/organizations.module");
let LevelModule = class LevelModule {
};
exports.LevelModule = LevelModule;
exports.LevelModule = LevelModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: level_schema_1.Level.name, schema: level_schema_1.LevelSchema },
                { name: term_schema_1.Term.name, schema: term_schema_1.TermSchema },
            ]),
            (0, common_1.forwardRef)(() => organizations_module_1.OrganizationsModule),
        ],
        controllers: [level_controller_1.LevelController, term_controller_1.TermController],
        providers: [level_service_1.LevelService, level_repository_1.LevelRepository, term_service_1.TermService, term_repository_1.TermRepository],
        exports: [level_service_1.LevelService, term_service_1.TermService],
    })
], LevelModule);
//# sourceMappingURL=level.module.js.map