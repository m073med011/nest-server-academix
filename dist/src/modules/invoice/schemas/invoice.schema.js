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
exports.InvoiceSchema = exports.Invoice = exports.BillingDataSchema = exports.BillingData = exports.InvoiceItemSchema = exports.InvoiceItem = exports.InvoiceStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
const course_schema_1 = require("../../courses/schemas/course.schema");
const payment_schema_1 = require("../../payments/schemas/payment.schema");
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["ISSUED"] = "issued";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["VOID"] = "void";
    InvoiceStatus["CANCELLED"] = "cancelled";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
let InvoiceItem = class InvoiceItem {
    courseId;
    courseName;
    price;
    quantity;
};
exports.InvoiceItem = InvoiceItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Course', required: true }),
    __metadata("design:type", course_schema_1.Course)
], InvoiceItem.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InvoiceItem.prototype, "courseName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 1 }),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "quantity", void 0);
exports.InvoiceItem = InvoiceItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], InvoiceItem);
exports.InvoiceItemSchema = mongoose_1.SchemaFactory.createForClass(InvoiceItem);
let BillingData = class BillingData {
    firstName;
    lastName;
    email;
    phoneNumber;
    address;
    city;
    country;
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
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BillingData.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BillingData.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BillingData.prototype, "country", void 0);
exports.BillingData = BillingData = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BillingData);
exports.BillingDataSchema = mongoose_1.SchemaFactory.createForClass(BillingData);
let Invoice = class Invoice {
    invoiceNumber;
    paymentId;
    userId;
    courseIds;
    amount;
    currency;
    paymentMethod;
    billingData;
    items;
    subtotal;
    discountAmount;
    tax;
    total;
    status;
    issuedAt;
    dueAt;
    paidAt;
};
exports.Invoice = Invoice;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Invoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Payment', required: true }),
    __metadata("design:type", payment_schema_1.Payment)
], Invoice.prototype, "paymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_schema_1.User)
], Invoice.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Course' }] }),
    __metadata("design:type", Array)
], Invoice.prototype, "courseIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Invoice.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'EGP' }),
    __metadata("design:type", String)
], Invoice.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['card'] }),
    __metadata("design:type", String)
], Invoice.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.BillingDataSchema, required: true }),
    __metadata("design:type", BillingData)
], Invoice.prototype, "billingData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.InvoiceItemSchema], required: true }),
    __metadata("design:type", Array)
], Invoice.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Invoice.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "discountAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "tax", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Invoice.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: InvoiceStatus, default: InvoiceStatus.ISSUED }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Invoice.prototype, "issuedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Invoice.prototype, "dueAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Invoice.prototype, "paidAt", void 0);
exports.Invoice = Invoice = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Invoice);
exports.InvoiceSchema = mongoose_1.SchemaFactory.createForClass(Invoice);
exports.InvoiceSchema.index({ userId: 1, createdAt: -1 });
exports.InvoiceSchema.index({ paymentId: 1 });
exports.InvoiceSchema.index({ invoiceNumber: 1 });
//# sourceMappingURL=invoice.schema.js.map