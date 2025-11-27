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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const invoice_repository_1 = require("./invoice.repository");
let InvoiceService = class InvoiceService {
    invoiceRepository;
    constructor(invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    create(createInvoiceDto) {
        return this.invoiceRepository.create(createInvoiceDto);
    }
    findAll() {
        return this.invoiceRepository.findAll();
    }
    findOne(id) {
        return this.invoiceRepository.findById(id);
    }
    findByUserId(userId) {
        return this.invoiceRepository.findByUserId(userId);
    }
    findByInvoiceNumber(invoiceNumber) {
        return this.invoiceRepository.findByInvoiceNumber(invoiceNumber);
    }
    update(id, updateInvoiceDto) {
        return this.invoiceRepository.update(id, updateInvoiceDto);
    }
    remove(id) {
        return this.invoiceRepository.delete(id);
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [invoice_repository_1.InvoiceRepository])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map