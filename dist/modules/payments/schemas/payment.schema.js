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
exports.PaymentSchema = exports.Payment = exports.BillingData = exports.PaymentStatus = exports.PaymentMethod = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
const course_schema_1 = require("../../courses/schemas/course.schema");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
    PaymentMethod["WALLET"] = "wallet";
    PaymentMethod["CASH"] = "cash";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["SUCCESS"] = "success";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["CANCELLED"] = "cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let BillingData = class BillingData {
    firstName;
    lastName;
    email;
    phoneNumber;
    apartment;
    floor;
    street;
    building;
    shippingMethod;
    postalCode;
    city;
    country;
    state;
};
exports.BillingData = BillingData;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BillingData.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BillingData.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BillingData.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BillingData.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], BillingData.prototype, "apartment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], BillingData.prototype, "floor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], BillingData.prototype, "street", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], BillingData.prototype, "building", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], BillingData.prototype, "shippingMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], BillingData.prototype, "postalCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], BillingData.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], BillingData.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], BillingData.prototype, "state", void 0);
exports.BillingData = BillingData = __decorate([
    (0, mongoose_1.Schema)()
], BillingData);
let Payment = class Payment {
    userId;
    courseId;
    courseIds;
    amount;
    originalAmount;
    discountAmount;
    discountCodeId;
    isCartPayment;
    currency;
    paymentMethod;
    status;
    paymobOrderId;
    paymobTransactionId;
    paymobPaymentId;
    billingData;
};
exports.Payment = Payment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_schema_1.User)
], Payment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Course' }),
    __metadata("design:type", course_schema_1.Course)
], Payment.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Course' }] }),
    __metadata("design:type", Array)
], Payment.prototype, "courseIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], Payment.prototype, "originalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], Payment.prototype, "discountAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'DiscountCode' }),
    __metadata("design:type", Object)
], Payment.prototype, "discountCodeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Payment.prototype, "isCartPayment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'EGP' }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PaymentMethod }),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "paymobOrderId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "paymobTransactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "paymobPaymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BillingData }),
    __metadata("design:type", BillingData)
], Payment.prototype, "billingData", void 0);
exports.Payment = Payment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Payment);
exports.PaymentSchema = mongoose_1.SchemaFactory.createForClass(Payment);
exports.PaymentSchema.index({ userId: 1 });
exports.PaymentSchema.index({ courseId: 1 });
exports.PaymentSchema.index({ courseIds: 1 });
exports.PaymentSchema.index({ paymobOrderId: 1 });
exports.PaymentSchema.index({ paymobTransactionId: 1 });
exports.PaymentSchema.index({ status: 1 });
exports.PaymentSchema.index({ discountCodeId: 1 });
exports.PaymentSchema.index({ isCartPayment: 1 });
exports.PaymentSchema.index({ userId: 1, isCartPayment: 1 });
//# sourceMappingURL=payment.schema.js.map