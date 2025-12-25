"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTermDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_term_dto_1 = require("./create-term.dto");
class UpdateTermDto extends (0, swagger_1.PartialType)(create_term_dto_1.CreateTermDto) {
}
exports.UpdateTermDto = UpdateTermDto;
//# sourceMappingURL=update-term.dto.js.map