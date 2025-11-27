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
exports.InvoiceRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const invoice_schema_1 = require("./schemas/invoice.schema");
let InvoiceRepository = class InvoiceRepository {
    invoiceModel;
    constructor(invoiceModel) {
        this.invoiceModel = invoiceModel;
    }
    async create(createInvoiceDto) {
        const newInvoice = new this.invoiceModel(createInvoiceDto);
        return newInvoice.save();
    }
    async findAll() {
        return this.invoiceModel.find().exec();
    }
    async findById(id) {
        return this.invoiceModel.findById(id).exec();
    }
    async findByUserId(userId) {
        return this.invoiceModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }
    async findByInvoiceNumber(invoiceNumber) {
        return this.invoiceModel.findOne({ invoiceNumber }).exec();
    }
    async update(id, updateInvoiceDto) {
        return this.invoiceModel
            .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
            .exec();
    }
    async delete(id) {
        return this.invoiceModel.findByIdAndDelete(id).exec();
    }
};
exports.InvoiceRepository = InvoiceRepository;
exports.InvoiceRepository = InvoiceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InvoiceRepository);
//# sourceMappingURL=invoice.repository.js.map