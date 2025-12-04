import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Headers,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { PaymobService } from './paymob.service';
import { CheckoutDto, CheckoutResponseDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CartService } from '../cart/cart.service';
import { CoursesService } from '../courses/courses.service';
import { DiscountService } from '../discount/discount.service';
import { InvoiceService } from '../invoice/invoice.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paymobService: PaymobService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
    @Inject(forwardRef(() => DiscountService))
    private readonly discountService: DiscountService,
    @Inject(forwardRef(() => InvoiceService))
    private readonly invoiceService: InvoiceService,
  ) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate checkout process' })
  @ApiResponse({ status: 200, type: CheckoutResponseDto })
  async initiateCheckout(@Request() req, @Body() checkoutDto: CheckoutDto) {
    const userId = req.user._id.toString();

    // Validate that either cartId or courseId is provided
    if (!checkoutDto.cartId && !checkoutDto.courseId) {
      throw new BadRequestException(
        'Either cartId or courseId must be provided',
      );
    }

    let courseIds: string[] = [];
    let totalAmount = 0;
    let isCartPayment = false;

    // Handle cart checkout
    if (checkoutDto.cartId) {
      const cart = await this.cartService.findByUserId(userId);

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // Extract course IDs and calculate total
      courseIds = cart.items.map((item) => item.courseId);
      isCartPayment = true;

      // Fetch courses and check if already purchased
      for (const courseId of courseIds) {
        const course = await this.coursesService.findOne(courseId);
        if (course) {
          // Check if user already owns this course
          const students = course.students || [];
          const isPurchased = students.some(
            (student: any) => student.toString() === userId,
          );

          if (isPurchased) {
            throw new BadRequestException(
              `You already own the course "${course.title}". Please remove it from your cart.`,
            );
          }

          totalAmount += course.price || 0;
        }
      }
    }
    // Handle single course checkout
    else if (checkoutDto.courseId) {
      const course = await this.coursesService.findOne(checkoutDto.courseId);

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      // Check if user already owns this course
      const students = course.students || [];
      const isPurchased = students.some(
        (student: any) => student.toString() === userId,
      );

      if (isPurchased) {
        throw new BadRequestException(
          `You already own the course "${course.title}".`,
        );
      }

      courseIds = [checkoutDto.courseId];
      totalAmount = course.price || 0;
      isCartPayment = false;
    }

    // Handle discount code if provided
    let discountCodeId: string | undefined;
    let discountAmount = 0;

    if (checkoutDto.discountCode) {
      const discountResult = await this.discountService.validateDiscount(
        checkoutDto.discountCode,
        courseIds,
      );

      if (!discountResult.valid) {
        throw new BadRequestException(
          discountResult.message || 'Invalid discount code',
        );
      }

      discountCodeId = discountResult.discount?._id;
      discountAmount = discountResult.discountAmount;

      this.logger.log(
        `Discount applied: ${checkoutDto.discountCode}, amount: ${discountAmount}`,
      );
    }

    // Initiate payment with discount
    return this.paymentsService.initiateCheckout(
      userId,
      checkoutDto,
      courseIds,
      totalAmount,
      isCartPayment,
      discountCodeId,
      discountAmount,
    );
  }

  @Post('verify/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually verify and complete payment (fallback for webhook)' })
  @ApiResponse({ status: 200, description: 'Payment verified and completed' })
  async manuallyVerifyPayment(@Param('paymentId') paymentId: string, @Request() req) {
    const userId = req.user._id.toString();

    try {
      const payment: any = await this.paymentsService.findOne(paymentId);

      if (!payment) {
        throw new BadRequestException('Payment not found');
      }

      // Verify the payment belongs to the user
      if (payment.userId.toString() !== userId) {
        throw new BadRequestException('Unauthorized access to payment');
      }

      // If already successful, return success
      if (payment.status === 'success') {
        return {
          success: true,
          message: 'Payment already completed',
          payment,
        };
      }

      // If pending, complete the payment manually
      if (payment.status === 'pending') {
        this.logger.log(`Manually completing payment: ${paymentId}`);

        // Update payment status
        await this.paymentsService.update(paymentId, {
          status: 'success',
          completedAt: new Date(),
        });

        // 1. Enroll user in all courses
        for (const courseId of payment.courseIds) {
          try {
            await this.coursesService.enroll(
              courseId.toString(),
              payment.userId.toString(),
            );
            this.logger.log(
              `User ${payment.userId} enrolled in course ${courseId}`,
            );
          } catch (error) {
            this.logger.error(
              `Enrollment failed for course ${courseId}:`,
              error,
            );
          }
        }

        // 2. Increment discount usage count if discount was used
        if (payment.discountCodeId) {
          try {
            await this.discountService.incrementUsageCount(
              payment.discountCodeId.toString(),
            );
            this.logger.log(
              `Discount usage count incremented for ${payment.discountCodeId}`,
            );
          } catch (error) {
            this.logger.error('Failed to increment discount usage:', error);
          }
        }

        // 3. Clear purchased courses from cart
        try {
          const cart = await this.cartService.findByUserId(payment.userId.toString());
          if (cart && cart.items.length > 0) {
            // Remove purchased courses from cart (batch operation)
            const courseIdsToRemove = payment.courseIds.map((id: any) => id.toString());
            await this.cartService.removeMultipleItems(payment.userId.toString(), courseIdsToRemove);
            this.logger.log(`Removed ${courseIdsToRemove.length} course(s) from cart for user ${payment.userId}`);
          } else {
            this.logger.log(`Cart empty or not found for user ${payment.userId}`);
          }
        } catch (error) {
          this.logger.error('Failed to update cart:', error);
          this.logger.error(error);
        }

        // 4. Create invoice
        try {
          const invoice = await this.createInvoiceForPayment(payment);
          this.logger.log(`Invoice created: ${invoice.invoiceNumber}`);
        } catch (error) {
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
    } catch (error) {
      this.logger.error('Manual payment verification failed:', error);
      throw error;
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Paymob webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(@Body() webhookData: any, @Headers('hmac') signature: string) {
    this.logger.log('Received Paymob webhook');

    // Verify webhook signature
    const isValid = this.paymobService.verifyWebhookSignature(
      webhookData,
      signature,
    );

    if (!isValid) {
      this.logger.warn('Invalid webhook signature');
      throw new BadRequestException('Invalid webhook signature');
    }

    // Process webhook
    await this.paymentsService.processWebhook(webhookData);

    // Handle payment success or failure
    const {
      obj: {
        order: { merchant_order_id },
        success,
      },
    } = webhookData;

    const payment: any = await this.paymentsService.findByMerchantOrderId(
      merchant_order_id,
    );

    if (!payment) {
      this.logger.warn(`Payment not found for order: ${merchant_order_id}`);
      return {
        success: true,
        message: 'Webhook received but payment not found',
      };
    }

    if (success) {
      this.logger.log(`Processing successful payment: ${payment._id}`);

      // 1. Enroll user in all courses
      for (const courseId of payment.courseIds) {
        try {
          await this.coursesService.enroll(
            courseId.toString(),
            payment.userId.toString(),
          );
          this.logger.log(
            `User ${payment.userId} enrolled in course ${courseId}`,
          );
        } catch (error) {
          this.logger.error(
            `Enrollment failed for course ${courseId}:`,
            error,
          );
        }
      }

      // 2. Increment discount usage count if discount was used
      if (payment.discountCodeId) {
        try {
          await this.discountService.incrementUsageCount(
            payment.discountCodeId.toString(),
          );
          this.logger.log(
            `Discount usage count incremented for ${payment.discountCodeId}`,
          );
        } catch (error) {
          this.logger.error('Failed to increment discount usage:', error);
        }
      }

      // 3. Clear purchased courses from cart
      try {
        const cart = await this.cartService.findByUserId(payment.userId.toString());
        if (cart && cart.items.length > 0) {
          // Remove purchased courses from cart (batch operation)
          const courseIdsToRemove = payment.courseIds.map((id: any) => id.toString());
          await this.cartService.removeMultipleItems(payment.userId.toString(), courseIdsToRemove);
          this.logger.log(`Removed ${courseIdsToRemove.length} course(s) from cart for user ${payment.userId}`);
        } else {
          this.logger.log(`Cart empty or not found for user ${payment.userId}`);
        }
      } catch (error) {
        this.logger.error('Failed to update cart:', error);
        this.logger.error(error);
      }

      // 4. Create invoice
      try {
        const invoice = await this.createInvoiceForPayment(payment);
        this.logger.log(`Invoice created: ${invoice.invoiceNumber}`);
      } catch (error) {
        this.logger.error('Failed to create invoice:', error);
      }
    } else {
      this.logger.log(`Payment failed: ${payment._id} - Cart NOT cleared`);
    }

    return {
      success: true,
      message: 'Webhook processed successfully',
    };
  }

  /**
   * Helper method to create invoice for successful payment
   */
  private async createInvoiceForPayment(payment: any) {
    // Fetch course details for invoice items
    const items: Array<{
      courseId: any;
      courseName: string;
      price: number;
      quantity: number;
    }> = [];
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
      } catch (error) {
        this.logger.error(`Failed to fetch course ${courseId}:`, error);
      }
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${payment.userId.toString().slice(-6)}`;

    // Create invoice
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

  @Post()
  create(@Body() createPaymentDto: any) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user payment history' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: any) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
