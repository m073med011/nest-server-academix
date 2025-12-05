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
var PaymentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const paymob_service_1 = require("./paymob.service");
const checkout_dto_1 = require("./dto/checkout.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const cart_service_1 = require("../cart/cart.service");
const courses_service_1 = require("../courses/courses.service");
const discount_service_1 = require("../discount/discount.service");
const invoice_service_1 = require("../invoice/invoice.service");
let PaymentsController = PaymentsController_1 = class PaymentsController {
    paymentsService;
    paymobService;
    cartService;
    coursesService;
    discountService;
    invoiceService;
    logger = new common_1.Logger(PaymentsController_1.name);
    constructor(paymentsService, paymobService, cartService, coursesService, discountService, invoiceService) {
        this.paymentsService = paymentsService;
        this.paymobService = paymobService;
        this.cartService = cartService;
        this.coursesService = coursesService;
        this.discountService = discountService;
        this.invoiceService = invoiceService;
    }
    async initiateCheckout(req, checkoutDto) {
        const userId = req.user._id.toString();
        if (!checkoutDto.cartId && !checkoutDto.courseId) {
            throw new common_1.BadRequestException('Either cartId or courseId must be provided');
        }
        let courseIds = [];
        let totalAmount = 0;
        let isCartPayment = false;
        if (checkoutDto.cartId) {
            const cart = await this.cartService.findByUserId(userId);
            if (!cart || cart.items.length === 0) {
                throw new common_1.BadRequestException('Cart is empty');
            }
            courseIds = cart.items.map((item) => item.courseId);
            isCartPayment = true;
            for (const courseId of courseIds) {
                const course = await this.coursesService.findOne(courseId);
                if (course) {
                    const students = course.students || [];
                    const isPurchased = students.some((student) => student.toString() === userId);
                    if (isPurchased) {
                        throw new common_1.BadRequestException(`You already own the course "${course.title}". Please remove it from your cart.`);
                    }
                    totalAmount += course.price || 0;
                }
            }
        }
        else if (checkoutDto.courseId) {
            const course = await this.coursesService.findOne(checkoutDto.courseId);
            if (!course) {
                throw new common_1.BadRequestException('Course not found');
            }
            const students = course.students || [];
            const isPurchased = students.some((student) => student.toString() === userId);
            if (isPurchased) {
                throw new common_1.BadRequestException(`You already own the course "${course.title}".`);
            }
            courseIds = [checkoutDto.courseId];
            totalAmount = course.price || 0;
            isCartPayment = false;
        }
        let discountCodeId;
        let discountAmount = 0;
        if (checkoutDto.discountCode) {
            const discountResult = await this.discountService.validateDiscount(checkoutDto.discountCode, courseIds);
            if (!discountResult.valid) {
                throw new common_1.BadRequestException(discountResult.message || 'Invalid discount code');
            }
            discountCodeId = discountResult.discount?._id;
            discountAmount = discountResult.discountAmount;
            this.logger.log(`Discount applied: ${checkoutDto.discountCode}, amount: ${discountAmount}`);
        }
        return this.paymentsService.initiateCheckout(userId, checkoutDto, courseIds, totalAmount, isCartPayment, discountCodeId, discountAmount);
    }
    async manuallyVerifyPayment(paymentId, req) {
        const userId = req.user._id.toString();
        try {
            const payment = await this.paymentsService.findOne(paymentId);
            if (!payment) {
                throw new common_1.BadRequestException('Payment not found');
            }
            if (payment.userId.toString() !== userId) {
                throw new common_1.BadRequestException('Unauthorized access to payment');
            }
            if (payment.status === 'success') {
                return {
                    success: true,
                    message: 'Payment already completed',
                    payment,
                };
            }
            if (payment.status === 'pending') {
                this.logger.log(`Manually completing payment: ${paymentId}`);
                await this.paymentsService.update(paymentId, {
                    status: 'success',
                    completedAt: new Date(),
                });
                for (const courseId of payment.courseIds) {
                    try {
                        await this.coursesService.enroll(courseId.toString(), payment.userId.toString());
                        this.logger.log(`User ${payment.userId} enrolled in course ${courseId}`);
                    }
                    catch (error) {
                        this.logger.error(`Enrollment failed for course ${courseId}:`, error);
                    }
                }
                if (payment.discountCodeId) {
                    try {
                        await this.discountService.incrementUsageCount(payment.discountCodeId.toString());
                        this.logger.log(`Discount usage count incremented for ${payment.discountCodeId}`);
                    }
                    catch (error) {
                        this.logger.error('Failed to increment discount usage:', error);
                    }
                }
                try {
                    const cart = await this.cartService.findByUserId(payment.userId.toString());
                    if (cart && cart.items.length > 0) {
                        const courseIdsToRemove = payment.courseIds.map((id) => id.toString());
                        await this.cartService.removeMultipleItems(payment.userId.toString(), courseIdsToRemove);
                        this.logger.log(`Removed ${courseIdsToRemove.length} course(s) from cart for user ${payment.userId}`);
                    }
                    else {
                        this.logger.log(`Cart empty or not found for user ${payment.userId}`);
                    }
                }
                catch (error) {
                    this.logger.error('Failed to update cart:', error);
                    this.logger.error(error);
                }
                try {
                    const invoice = await this.createInvoiceForPayment(payment);
                    this.logger.log(`Invoice created: ${invoice.invoiceNumber}`);
                }
                catch (error) {
                    this.logger.error('Failed to create invoice:', error);
                }
                const updatedPayment = await this.paymentsService.findOne(paymentId);
                return {
                    success: true,
                    message: 'Payment completed successfully',
                    payment: updatedPayment,
                };
            }
            return {
                success: false,
                message: 'Payment is not in a verifiable state',
                payment,
            };
        }
        catch (error) {
            this.logger.error('Manual payment verification failed:', error);
            throw error;
        }
    }
    async handleWebhook(webhookData, signature) {
        this.logger.log('=== PAYMOB WEBHOOK RECEIVED ===');
        this.logger.log(`Webhook data: ${JSON.stringify(webhookData)}`);
        this.logger.log(`HMAC signature: ${signature}`);
        const isValid = this.paymobService.verifyWebhookSignature(webhookData, signature);
        if (!isValid) {
            this.logger.warn('Invalid webhook signature');
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        await this.paymentsService.processWebhook(webhookData);
        const { obj: { order: { merchant_order_id }, success, }, } = webhookData;
        const payment = await this.paymentsService.findByMerchantOrderId(merchant_order_id);
        if (!payment) {
            this.logger.warn(`Payment not found for order: ${merchant_order_id}`);
            return {
                success: true,
                message: 'Webhook received but payment not found',
            };
        }
        if (success) {
            this.logger.log(`Processing successful payment: ${payment._id}`);
            for (const courseId of payment.courseIds) {
                try {
                    await this.coursesService.enroll(courseId.toString(), payment.userId.toString());
                    this.logger.log(`User ${payment.userId} enrolled in course ${courseId}`);
                }
                catch (error) {
                    this.logger.error(`Enrollment failed for course ${courseId}:`, error);
                }
            }
            if (payment.discountCodeId) {
                try {
                    await this.discountService.incrementUsageCount(payment.discountCodeId.toString());
                    this.logger.log(`Discount usage count incremented for ${payment.discountCodeId}`);
                }
                catch (error) {
                    this.logger.error('Failed to increment discount usage:', error);
                }
            }
            try {
                const cart = await this.cartService.findByUserId(payment.userId.toString());
                if (cart && cart.items.length > 0) {
                    const courseIdsToRemove = payment.courseIds.map((id) => id.toString());
                    await this.cartService.removeMultipleItems(payment.userId.toString(), courseIdsToRemove);
                    this.logger.log(`Removed ${courseIdsToRemove.length} course(s) from cart for user ${payment.userId}`);
                }
                else {
                    this.logger.log(`Cart empty or not found for user ${payment.userId}`);
                }
            }
            catch (error) {
                this.logger.error('Failed to update cart:', error);
                this.logger.error(error);
            }
            try {
                const invoice = await this.createInvoiceForPayment(payment);
                this.logger.log(`Invoice created: ${invoice.invoiceNumber}`);
            }
            catch (error) {
                this.logger.error('Failed to create invoice:', error);
            }
        }
        else {
            this.logger.log(`Payment failed: ${payment._id} - Cart NOT cleared`);
        }
        return {
            success: true,
            message: 'Webhook processed successfully',
        };
    }
    async createInvoiceForPayment(payment) {
        const items = [];
        for (const courseId of payment.courseIds) {
            try {
                const course = await this.coursesService.findOne(courseId.toString());
                if (course) {
                    items.push({
                        courseId: courseId,
                        courseName: course.title,
                        price: course.price || 0,
                        quantity: 1,
                    });
                }
            }
            catch (error) {
                this.logger.error(`Failed to fetch course ${courseId}:`, error);
            }
        }
        const invoiceNumber = `INV-${Date.now()}-${payment.userId.toString().slice(-6)}`;
        const invoiceData = {
            invoiceNumber,
            paymentId: payment._id,
            userId: payment.userId,
            courseIds: payment.courseIds,
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            billingData: {
                firstName: payment.billingData.firstName,
                lastName: payment.billingData.lastName,
                email: payment.billingData.email,
                phoneNumber: payment.billingData.phoneNumber,
                address: payment.billingData.street || '',
                city: payment.billingData.city || '',
                country: payment.billingData.country || 'EG',
            },
            items,
            subtotal: payment.originalAmount || payment.amount,
            discountAmount: payment.discountAmount || 0,
            tax: 0,
            total: payment.amount,
            status: 'paid',
            issuedAt: new Date(),
            paidAt: new Date(),
        };
        return this.invoiceService.create(invoiceData);
    }
    create(createPaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }
    findAll() {
        return this.paymentsService.findAll();
    }
    findOne(id) {
        return this.paymentsService.findOne(id);
    }
    update(id, updatePaymentDto) {
        return this.paymentsService.update(id, updatePaymentDto);
    }
    remove(id) {
        return this.paymentsService.remove(id);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate checkout process' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: checkout_dto_1.CheckoutResponseDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_dto_1.CheckoutDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiateCheckout", null);
__decorate([
    (0, common_1.Post)('verify/:paymentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Manually verify and complete payment (fallback for webhook)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment verified and completed' }),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "manuallyVerifyPayment", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Handle Paymob webhook' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('hmac')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user payment history' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "remove", null);
exports.PaymentsController = PaymentsController = PaymentsController_1 = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, common_1.Controller)('payments'),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => cart_service_1.CartService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => courses_service_1.CoursesService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => discount_service_1.DiscountService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => invoice_service_1.InvoiceService))),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        paymob_service_1.PaymobService,
        cart_service_1.CartService,
        courses_service_1.CoursesService,
        discount_service_1.DiscountService,
        invoice_service_1.InvoiceService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map