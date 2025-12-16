import { PaymentsService } from './payments.service';
import { PaymobService } from './paymob.service';
import { CheckoutDto } from './dto/checkout.dto';
import { CartService } from '../cart/cart.service';
import { CoursesService } from '../courses/courses.service';
import { DiscountService } from '../discount/discount.service';
import { InvoiceService } from '../invoice/invoice.service';
import { UsersService } from '../users/users.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly paymobService;
    private readonly cartService;
    private readonly coursesService;
    private readonly discountService;
    private readonly invoiceService;
    private readonly usersService;
    private readonly logger;
    constructor(paymentsService: PaymentsService, paymobService: PaymobService, cartService: CartService, coursesService: CoursesService, discountService: DiscountService, invoiceService: InvoiceService, usersService: UsersService);
    initiateCheckout(req: any, checkoutDto: CheckoutDto): Promise<{
        success: boolean;
        payment: any;
        paymentUrl: string;
        message: string;
    } | {
        success: boolean;
        payment: any;
        message: string;
    }>;
    manuallyVerifyPayment(paymentId: string, req: any): Promise<{
        success: boolean;
        message: string;
        payment: any;
    }>;
    handleWebhook(webhookData: any, signature: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private createInvoiceForPayment;
    create(createPaymentDto: any): Promise<import("./schemas/payment.schema").Payment>;
    findAll(): Promise<import("./schemas/payment.schema").Payment[]>;
    findOne(id: string): Promise<import("./schemas/payment.schema").Payment | null>;
    update(id: string, updatePaymentDto: any): Promise<import("./schemas/payment.schema").Payment | null>;
    remove(id: string): Promise<import("./schemas/payment.schema").Payment | null>;
}
