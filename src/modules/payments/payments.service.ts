import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { PaymobService } from './paymob.service';
import { CheckoutDto } from './dto/checkout.dto';
import { PaymentStatus, PaymentMethod } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly paymobService: PaymobService,
  ) {}

  create(createPaymentDto: any) {
    return this.paymentsRepository.create(createPaymentDto);
  }

  findAll() {
    return this.paymentsRepository.findAll();
  }

  findOne(id: string) {
    return this.paymentsRepository.findById(id);
  }

  async findByMerchantOrderId(merchantOrderId: string) {
    return this.paymentsRepository.findByMerchantOrderId(merchantOrderId);
  }

  update(id: string, updatePaymentDto: any) {
    return this.paymentsRepository.update(id, updatePaymentDto);
  }

  remove(id: string) {
    return this.paymentsRepository.delete(id);
  }

  countSuccessfulPurchasesByUser(userId: string) {
    return this.paymentsRepository.countSuccessfulPurchasesByUser(userId);
  }

  calculateTotalRevenueForInstructor(instructorId: string) {
    return this.paymentsRepository.calculateTotalRevenueForInstructor(
      instructorId,
    );
  }

  getUserPurchasedCourses(userId: string) {
    return this.paymentsRepository.findPurchasedCoursesByUser(userId);
  }

  /**
   * Initiate checkout process
   * Handles both cart and single course purchases with optional discount
   */
  async initiateCheckout(
    userId: string,
    checkoutDto: CheckoutDto,
    courseIds: string[],
    totalAmount: number,
    isCartPayment: boolean,
    discountCodeId?: string,
    discountAmount?: number,
  ) {
    try {
      const merchantOrderId = `payment_${Date.now()}_${userId.slice(-8)}`;

      // Cancel any existing pending payments for the same courses by this user
      const existingPendingPayments =
        await this.paymentsRepository.findPendingPaymentsByUserAndCourses(
          userId,
          courseIds,
        );

      if (existingPendingPayments.length > 0) {
        const pendingPaymentIds = existingPendingPayments.map((p: any) =>
          p._id.toString(),
        );
        await this.paymentsRepository.cancelPendingPayments(pendingPaymentIds);
        this.logger.log(
          `Cancelled ${pendingPaymentIds.length} pending payment(s) for user ${userId}`,
        );
      }

      // Calculate final amount after discount
      const finalAmount = discountAmount
        ? Math.max(0, totalAmount - discountAmount)
        : totalAmount;

      // Create payment record
      const paymentData = {
        userId,
        courseIds,
        amount: finalAmount,
        originalAmount: totalAmount,
        discountAmount: discountAmount || 0,
        discountCodeId: discountCodeId || undefined,
        currency: 'EGP',
        paymentMethod: checkoutDto.paymentMethod,
        status: PaymentStatus.PENDING,
        billingData: checkoutDto.billingData,
        isCartPayment,
        paymobOrderId: merchantOrderId,
      };

      const payment: any = await this.paymentsRepository.create(paymentData);

      // If cash payment, return success without Paymob
      if (checkoutDto.paymentMethod === PaymentMethod.CASH) {
        return {
          success: true,
          payment,
          message: 'Payment order created successfully. Cash on delivery.',
        };
      }

      // Process payment with Paymob using final amount
      this.logger.log(`Processing payment with Paymob for amount: ${finalAmount} EGP`);
      const paymobResponse = await this.paymobService.processPayment(
        {
          amount: finalAmount,
          currency: 'EGP',
          merchantOrderId,
          billingData: checkoutDto.billingData,
          paymentMethod: checkoutDto.paymentMethod,
        },
        payment._id.toString(),
      );

      this.logger.log(`Paymob response received: ${JSON.stringify({ orderId: paymobResponse.orderId, iframeUrl: paymobResponse.iframeUrl })}`);

      // Update payment with Paymob data
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
    } catch (error) {
      this.logger.error('Checkout initiation failed:', error);
      throw new BadRequestException(
        error.message || 'Failed to initiate checkout',
      );
    }
  }

  /**
   * Process webhook from Paymob
   */
  async processWebhook(webhookData: any): Promise<void> {
    try {
      const {
        obj: {
          id: transactionId,
          order: { merchant_order_id },
          success,
          amount_cents,
        },
      } = webhookData;

      this.logger.log(
        `Processing webhook for order: ${merchant_order_id}, success: ${success}`,
      );

      // Find payment by merchant order ID
      const payment: any = await this.findByMerchantOrderId(merchant_order_id);

      if (!payment) {
        this.logger.warn(`Payment not found for order: ${merchant_order_id}`);
        return;
      }

      // Verify amount matches
      const expectedAmountCents = Math.round(payment.amount * 100);
      if (amount_cents !== expectedAmountCents) {
        this.logger.error(
          `Amount mismatch: expected ${expectedAmountCents}, got ${amount_cents}`,
        );
        throw new BadRequestException('Payment amount mismatch');
      }

      if (success) {
        // Update payment status to success
        await this.update(payment._id.toString(), {
          status: PaymentStatus.SUCCESS,
          paymobTransactionId: transactionId.toString(),
        });

        this.logger.log(`Payment ${payment._id} marked as successful`);

        // TODO: Enroll user in courses (will be implemented in controller)
        // TODO: Clear cart if cart payment
        // TODO: Send confirmation email
        // TODO: Create invoice
      } else {
        // Update payment status to failed
        await this.update(payment._id.toString(), {
          status: PaymentStatus.FAILED,
          paymobTransactionId: transactionId.toString(),
        });

        this.logger.log(`Payment ${payment._id} marked as failed`);
      }
    } catch (error) {
      this.logger.error('Webhook processing failed:', error);
      throw error;
    }
  }
}
