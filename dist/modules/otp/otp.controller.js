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
exports.OtpController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const otp_service_1 = require("./otp.service");
const otp_dto_1 = require("./dto/otp.dto");
let OtpController = class OtpController {
    otpService;
    constructor(otpService) {
        this.otpService = otpService;
    }
    async generate(generateOtpDto) {
        return this.otpService.generateOtp(generateOtpDto.email, generateOtpDto.purpose);
    }
    async verify(verifyOtpDto) {
        return this.otpService.verifyOtp(verifyOtpDto.email, verifyOtpDto.code, verifyOtpDto.purpose);
    }
    async resend(resendOtpDto) {
        return this.otpService.generateOtp(resendOtpDto.email, resendOtpDto.purpose);
    }
};
exports.OtpController = OtpController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate and send OTP via email',
        description: 'Generates a secure 6-digit OTP and sends it to the specified email address via Brevo',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'OTP sent successfully',
        schema: {
            example: {
                success: true,
                message: 'OTP sent to user@example.com',
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid request data',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.GenerateOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify OTP code',
        description: 'Verifies the provided OTP code against the stored OTP for the email and purpose',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'OTP verified successfully',
        schema: {
            example: {
                success: true,
                message: 'OTP verified successfully',
                verified: true,
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid OTP or maximum attempts exceeded',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'OTP not found or expired',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('resend'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Resend OTP code',
        description: 'Generates a new OTP and sends it to the email address. Previous OTP will be invalidated',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'OTP resent successfully',
        schema: {
            example: {
                success: true,
                message: 'OTP sent to user@example.com',
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid request data',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.ResendOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "resend", null);
exports.OtpController = OtpController = __decorate([
    (0, swagger_1.ApiTags)('OTP'),
    (0, common_1.Controller)('otp'),
    __metadata("design:paramtypes", [otp_service_1.OtpService])
], OtpController);
//# sourceMappingURL=otp.controller.js.map