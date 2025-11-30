"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const otp_controller_1 = require("./otp.controller");
const otp_service_1 = require("./otp.service");
const otp_repository_1 = require("./otp.repository");
const otp_schema_1 = require("./schemas/otp.schema");
const email_module_1 = require("../email/email.module");
let OtpModule = class OtpModule {
};
exports.OtpModule = OtpModule;
exports.OtpModule = OtpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: otp_schema_1.Otp.name, schema: otp_schema_1.OtpSchema }]),
            config_1.ConfigModule,
            email_module_1.EmailModule,
        ],
        controllers: [otp_controller_1.OtpController],
        providers: [otp_service_1.OtpService, otp_repository_1.OtpRepository],
        exports: [otp_service_1.OtpService],
    })
], OtpModule);
//# sourceMappingURL=otp.module.js.map