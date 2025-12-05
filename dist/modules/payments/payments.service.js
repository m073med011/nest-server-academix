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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const payments_repository_1 = require("./payments.repository");
const paymob_service_1 = require("./paymob.service");
const payment_schema_1 = require("./schemas/payment.schema");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    paymentsRepository;
    paymobService;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(paymentsRepository, paymobService) {
        this.paymentsRepository = paymentsRepository;
        this.paymobService = paymobService;
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
    async findByMerchantOrderId(merchantOrderId) {
        return this.paymentsRepository.findByMerchantOrderId(merchantOrderId);
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
    async initiateCheckout(userId, checkoutDto, courseIds, totalAmount, isCartPayment, discountCodeId, discountAmount) {
        try {
            const merchantOrderId = `payment_${Date.now()}_${userId.slice(-8)}`;
            const existingPendingPayments = await this.paymentsRepository.findPendingPaymentsByUserAndCourses(userId, courseIds);
            if (existingPendingPayments.length > 0) {
                const pendingPaymentIds = existingPendingPayments.map((p) => p._id.toString());
                await this.paymentsRepository.cancelPendingPayments(pendingPaymentIds);
                this.logger.log(`Cancelled ${pendingPaymentIds.length} pending payment(s) for user ${userId}`);
            }
            const finalAmount = discountAmount
                ? Math.max(0, totalAmount - discountAmount)
                : totalAmount;
            const paymentData = {
                userId,
                courseIds,
                amount: finalAmount,
                originalAmount: totalAmount,
                discountAmount: discountAmount || 0,
                discountCodeId: discountCodeId || undefined,
                currency: 'EGP',
                paymentMethod: checkoutDto.paymentMethod,
                status: payment_schema_1.PaymentStatus.PENDING,
                billingData: checkoutDto.billingData,
                isCartPayment,
                paymobOrderId: merchantOrderId,
            };
            const payment = await this.paymentsRepository.create(paymentData);
            if (checkoutDto.paymentMethod === payment_schema_1.PaymentMethod.CASH) {
                return {
                    success: true,
                    payment,
                    message: 'Payment order created successfully. Cash on delivery.',
                };
            }
            this.logger.log(`Processing payment with Paymob for amount: ${finalAmount} EGP`);
            const paymobResponse = await this.paymobService.processPayment({
                amount: finalAmount,
                currency: 'EGP',
                merchantOrderId,
                billingData: checkoutDto.billingData,
                paymentMethod: checkoutDto.paymentMethod,
            }, payment._id.toString());
            this.logger.log(`Paymob response received: ${JSON.stringify({ orderId: paymobResponse.orderId, iframeUrl: paymobResponse.iframeUrl })}`);
            await this.paymentsRepository.update(payment._id.toString(), {
                paymobOrderId: paymobResponse.orderId.toString(),
                paymobPaymentId: paymobResponse.paymentToken,
            });
            const response = {
                success: true,
                payment,
                paymentUrl: paymobResponse.iframeUrl,
                message: 'Payment initiated successfully',
            };
            this.logger.log(`Returning payment response with paymentUrl: ${response.paymentUrl}`);
            return response;
        }
        catch (error) {
            this.logger.error('Checkout initiation failed:', error);
            throw new common_1.BadRequestException(error.message || 'Failed to initiate checkout');
        }
    }
    async processWebhook(webhookData) {
        try {
            const { obj: { id: transactionId, order: { merchant_order_id }, success, amount_cents, }, } = webhookData;
            this.logger.log(`Processing webhook for order: ${merchant_order_id}, success: ${success}`);
            const payment = await this.findByMerchantOrderId(merchant_order_id);
            if (!payment) {
                this.logger.warn(`Payment not found for order: ${merchant_order_id}`);
                return;
            }
            const expectedAmountCents = Math.round(payment.amount * 100);
            if (amount_cents !== expectedAmountCents) {
                this.logger.error(`Amount mismatch: expected ${expectedAmountCents}, got ${amount_cents}`);
                throw new common_1.BadRequestException('Payment amount mismatch');
            }
            if (success) {
                await this.update(payment._id.toString(), {
                    status: payment_schema_1.PaymentStatus.SUCCESS,
                    paymobTransactionId: transactionId.toString(),
                });
                this.logger.log(`Payment ${payment._id} marked as successful`);
            }
            else {
                await this.update(payment._id.toString(), {
                    status: payment_schema_1.PaymentStatus.FAILED,
                    paymobTransactionId: transactionId.toString(),
                });
                this.logger.log(`Payment ${payment._id} marked as failed`);
            }
        }
        catch (error) {
            this.logger.error('Webhook processing failed:', error);
            throw error;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_repository_1.PaymentsRepository,
        paymob_service_1.PaymobService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map