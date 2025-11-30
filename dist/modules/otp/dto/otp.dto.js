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
exports.ResendOtpDto = exports.VerifyOtpDto = exports.GenerateOtpDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const otp_schema_1 = require("../schemas/otp.schema");
class GenerateOtpDto {
    email;
    purpose;
}
exports.GenerateOtpDto = GenerateOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Email address to send OTP to',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], GenerateOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: otp_schema_1.OtpPurpose.EMAIL_VERIFICATION,
        enum: otp_schema_1.OtpPurpose,
        description: 'Purpose of the OTP',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(otp_schema_1.OtpPurpose),
    __metadata("design:type", String)
], GenerateOtpDto.prototype, "purpose", void 0);
class VerifyOtpDto {
    email;
    code;
    purpose;
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Email address associated with OTP',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123456',
        description: '6-digit OTP code',
        minLength: 6,
        maxLength: 6,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'OTP code must be exactly 6 digits' }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: otp_schema_1.OtpPurpose.EMAIL_VERIFICATION,
        enum: otp_schema_1.OtpPurpose,
        description: 'Purpose of the OTP',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(otp_schema_1.OtpPurpose),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "purpose", void 0);
class ResendOtpDto {
    email;
    purpose;
}
exports.ResendOtpDto = ResendOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Email address to resend OTP to',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ResendOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: otp_schema_1.OtpPurpose.EMAIL_VERIFICATION,
        enum: otp_schema_1.OtpPurpose,
        description: 'Purpose of the OTP',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(otp_schema_1.OtpPurpose),
    __metadata("design:type", String)
], ResendOtpDto.prototype, "purpose", void 0);
//# sourceMappingURL=otp.dto.js.map