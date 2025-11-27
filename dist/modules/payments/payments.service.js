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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const payments_repository_1 = require("./payments.repository");
let PaymentsService = class PaymentsService {
    paymentsRepository;
    constructor(paymentsRepository) {
        this.paymentsRepository = paymentsRepository;
    }
    create(createPaymentDto) {
        return this.paymentsRepository.create(createPaymentDto);
    }
    findAll() {
        return this.paymentsRepository.findAll();
    }
    findOne(id) {
        return this.paymentsRepository.findById(id);
    }
    update(id, updatePaymentDto) {
        return this.paymentsRepository.update(id, updatePaymentDto);
    }
    remove(id) {
        return this.paymentsRepository.delete(id);
    }
    countSuccessfulPurchasesByUser(userId) {
        return this.paymentsRepository.countSuccessfulPurchasesByUser(userId);
    }
    calculateTotalRevenueForInstructor(instructorId) {
        return this.paymentsRepository.calculateTotalRevenueForInstructor(instructorId);
    }
    getUserPurchasedCourses(userId) {
        return this.paymentsRepository.findPurchasedCoursesByUser(userId);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_repository_1.PaymentsRepository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map