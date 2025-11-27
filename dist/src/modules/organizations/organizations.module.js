"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const organizations_controller_1 = require("./organizations.controller");
const organizations_service_1 = require("./organizations.service");
const organizations_repository_1 = require("./organizations.repository");
const organization_schema_1 = require("./schemas/organization.schema");
const organization_role_schema_1 = require("./schemas/organization-role.schema");
const organization_membership_schema_1 = require("./schemas/organization-membership.schema");
const organization_membership_repository_1 = require("./organization-membership.repository");
const term_schema_1 = require("./schemas/term.schema");
const term_repository_1 = require("./term.repository");
const organization_role_repository_1 = require("./organization-role.repository");
const users_module_1 = require("../users/users.module");
const courses_module_1 = require("../courses/courses.module");
let OrganizationsModule = class OrganizationsModule {
};
exports.OrganizationsModule = OrganizationsModule;
exports.OrganizationsModule = OrganizationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: organization_schema_1.Organization.name, schema: organization_schema_1.OrganizationSchema },
                { name: organization_role_schema_1.OrganizationRole.name, schema: organization_role_schema_1.OrganizationRoleSchema },
                {
                    name: organization_membership_schema_1.OrganizationMembership.name,
                    schema: organization_membership_schema_1.OrganizationMembershipSchema,
                },
                { name: term_schema_1.Term.name, schema: term_schema_1.TermSchema },
            ]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            (0, common_1.forwardRef)(() => courses_module_1.CoursesModule),
        ],
        controllers: [organizations_controller_1.OrganizationsController],
        providers: [
            organizations_service_1.OrganizationsService,
            organizations_repository_1.OrganizationsRepository,
            organization_membership_repository_1.OrganizationMembershipRepository,
            organization_role_repository_1.OrganizationRoleRepository,
            term_repository_1.TermRepository,
        ],
        exports: [
            organizations_service_1.OrganizationsService,
            organization_membership_repository_1.OrganizationMembershipRepository,
            organization_role_repository_1.OrganizationRoleRepository,
            term_repository_1.TermRepository,
        ],
    })
], OrganizationsModule);
//# sourceMappingURL=organizations.module.js.map