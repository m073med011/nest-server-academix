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
var OtpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const otp_repository_1 = require("./otp.repository");
const brevo_service_1 = require("../email/brevo.service");
let OtpService = OtpService_1 = class OtpService {
    otpRepository;
    brevoService;
    configService;
    logger = new common_1.Logger(OtpService_1.name);
    constructor(otpRepository, brevoService, configService) {
        this.otpRepository = otpRepository;
        this.brevoService = brevoService;
        this.configService = configService;
    }
    async generateOtp(email, purpose) {
        try {
            this.logger.log(`Generating OTP for ${email} - Purpose: ${purpose}`);
            const code = this.generateSecureOtpCode();
            const expirationMinutes = this.configService.get('app.otp.expirationMinutes') || 10;
            const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
            const existingOtp = await this.otpRepository.findByEmailAndPurpose(email.toLowerCase(), purpose);
            if (existingOtp) {
                await this.otpRepository.delete(existingOtp._id.toString());
                this.logger.log(`Deleted existing OTP for ${email}`);
            }
            await this.otpRepository.create({
                code,
                email: email.toLowerCase(),
                purpose,
                expiresAt,
                verified: false,
                attempts: 0,
            });
            await this.brevoService.sendOtpEmail(email, code, purpose);
            this.logger.log(`OTP sent successfully to ${email}`);
            return {
                success: true,
                message: `OTP sent to ${email}`,
            };
        }
        catch (error) {
            this.logger.error(`Failed to generate OTP: ${error.message}`, error.stack);
            throw error;
        }
    }
    async verifyOtp(email, code, purpose) {
        try {
            this.logger.log(`Verifying OTP for ${email} - Purpose: ${purpose}`);
            const otp = await this.otpRepository.findByEmailAndPurpose(email.toLowerCase(), purpose);
            if (!otp) {
                this.logger.warn(`OTP not found for ${email}`);
                throw new common_1.NotFoundException('Invalid or expired OTP');
            }
            if (otp.verified) {
                this.logger.warn(`OTP already used for ${email}`);
                throw new common_1.BadRequestException('OTP has already been used');
            }
            const maxAttempts = this.configService.get('app.otp.maxAttempts') || 5;
            if (otp.attempts >= maxAttempts) {
                this.logger.warn(`Maximum attempts exceeded for ${email} - Attempts: ${otp.attempts}`);
                throw new common_1.BadRequestException('Maximum verification attempts exceeded. Please request a new OTP');
            }
            if (new Date() > otp.expiresAt) {
                this.logger.warn(`OTP expired for ${email}`);
                throw new common_1.BadRequestException('OTP has expired. Please request a new one');
            }
            if (otp.code !== code) {
                await this.otpRepository.incrementAttempts(otp._id.toString());
                const remainingAttempts = (maxAttempts || 5) - (otp.attempts + 1);
                this.logger.warn(`Invalid OTP code for ${email} - Remaining attempts: ${remainingAttempts}`);
                if (remainingAttempts <= 0) {
                    throw new common_1.BadRequestException('Invalid OTP. Maximum attempts exceeded. Please request a new OTP');
                }
                throw new common_1.BadRequestException(`Invalid OTP. ${remainingAttempts} attempts remaining`);
            }
            await this.otpRepository.verify(otp._id.toString());
            this.logger.log(`OTP verified successfully for ${email}`);
            return {
                success: true,
                message: 'OTP verified successfully',
                verified: true,
            };
        }
        catch (error) {
            this.logger.error(`Failed to verify OTP: ${error.message}`, error.stack);
            throw error;
        }
    }
    generateSecureOtpCode() {
        const min = 100000;
        const max = 999999;
        const randomNumber = crypto.randomInt(min, max + 1);
        return randomNumber.toString();
    }
    async remove(id) {
        await this.otpRepository.delete(id);
    }
    async findByEmailAndPurpose(email, purpose) {
        return this.otpRepository.findByEmailAndPurpose(email, purpose);
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = OtpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [otp_repository_1.OtpRepository,
        brevo_service_1.BrevoService,
        config_1.ConfigService])
], OtpService);
//# sourceMappingURL=otp.service.js.map