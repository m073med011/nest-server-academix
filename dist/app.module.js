"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const nest_winston_1 = require("nest-winston");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const configuration_1 = require("./config/configuration");
const winston_config_1 = require("./config/winston.config");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const courses_module_1 = require("./modules/courses/courses.module");
const organizations_module_1 = require("./modules/organizations/organizations.module");
const payments_module_1 = require("./modules/payments/payments.module");
const analysis_module_1 = require("./modules/analysis/analysis.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const cart_module_1 = require("./modules/cart/cart.module");
const chat_module_1 = require("./modules/chat/chat.module");
const discount_module_1 = require("./modules/discount/discount.module");
const invoice_module_1 = require("./modules/invoice/invoice.module");
const level_module_1 = require("./modules/level/level.module");
const material_module_1 = require("./modules/material/material.module");
const otp_module_1 = require("./modules/otp/otp.module");
const database_module_1 = require("./modules/database/database.module");
const health_module_1 = require("./modules/health/health.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validationSchema: configuration_1.validationSchema,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    uri: configService.get('app.database.uri'),
                }),
                inject: [config_1.ConfigService],
            }),
            nest_winston_1.WinstonModule.forRoot(winston_config_1.winstonConfig),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 20,
                },
            ]),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            courses_module_1.CoursesModule,
            organizations_module_1.OrganizationsModule,
            payments_module_1.PaymentsModule,
            analysis_module_1.AnalysisModule,
            attendance_module_1.AttendanceModule,
            cart_module_1.CartModule,
            chat_module_1.ChatModule,
            discount_module_1.DiscountModule,
            invoice_module_1.InvoiceModule,
            level_module_1.LevelModule,
            material_module_1.MaterialModule,
            otp_module_1.OtpModule,
            database_module_1.DatabaseModule,
            health_module_1.HealthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map