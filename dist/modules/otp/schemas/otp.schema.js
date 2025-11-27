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
exports.OtpSchema = exports.Otp = exports.OtpPurpose = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var OtpPurpose;
(function (OtpPurpose) {
    OtpPurpose["PASSWORD_RESET"] = "password_reset";
    OtpPurpose["EMAIL_VERIFICATION"] = "email_verification";
    OtpPurpose["LOGIN_VERIFICATION"] = "login_verification";
})(OtpPurpose || (exports.OtpPurpose = OtpPurpose = {}));
let Otp = class Otp {
    code;
    email;
    purpose;
    expiresAt;
    verified;
    attempts;
};
exports.Otp = Otp;
__decorate([
    (0, mongoose_1.Prop)({ required: true, length: 6, match: /^\d{6}$/ }),
    __metadata("design:type", String)
], Otp.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    }),
    __metadata("design:type", String)
], Otp.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: OtpPurpose }),
    __metadata("design:type", String)
], Otp.prototype, "purpose", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: { expireAfterSeconds: 0 } }),
    __metadata("design:type", Date)
], Otp.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Otp.prototype, "verified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, max: 5 }),
    __metadata("design:type", Number)
], Otp.prototype, "attempts", void 0);
exports.Otp = Otp = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Otp);
exports.OtpSchema = mongoose_1.SchemaFactory.createForClass(Otp);
exports.OtpSchema.index({ email: 1, purpose: 1, expiresAt: 1 });
exports.OtpSchema.index({ email: 1, purpose: 1, verified: 1 });
exports.OtpSchema.index({ email: 1, purpose: 1 }, {
    partialFilterExpression: {
        verified: false,
        expiresAt: { $gt: new Date() },
    },
    unique: true,
});
//# sourceMappingURL=otp.schema.js.map