"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireOwner = exports.REQUIRE_OWNER_KEY = exports.RequirePermission = exports.ORGANIZATION_PERMISSION_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ORGANIZATION_PERMISSION_KEY = 'organizationPermission';
const RequirePermission = (permission) => (0, common_1.SetMetadata)(exports.ORGANIZATION_PERMISSION_KEY, permission);
exports.RequirePermission = RequirePermission;
exports.REQUIRE_OWNER_KEY = 'requireOwner';
const RequireOwner = () => (0, common_1.SetMetadata)(exports.REQUIRE_OWNER_KEY, true);
exports.RequireOwner = RequireOwner;
//# sourceMappingURL=organization-permission.decorator.js.map