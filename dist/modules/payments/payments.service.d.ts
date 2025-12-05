import { PaymentsRepository } from './payments.repository';
import { PaymobService } from './paymob.service';
import { CheckoutDto } from './dto/checkout.dto';
export declare class PaymentsService {
    private readonly paymentsRepository;
    private readonly paymobService;
    private readonly logger;
    constructor(paymentsRepository: PaymentsRepository, paymobService: PaymobService);
    create(createPaymentDto: any): Promise<import("./schemas/payment.schema").Payment>;
    findAll(): Promise<import("./schemas/payment.schema").Payment[]>;
    findOne(id: string): Promise<import("./schemas/payment.schema").Payment | null>;
    findByMerchantOrderId(merchantOrderId: string): Promise<import("./schemas/payment.schema").Payment | null>;
    update(id: string, updatePaymentDto: any): Promise<import("./schemas/payment.schema").Payment | null>;
    remove(id: string): Promise<import("./schemas/payment.schema").Payment | null>;
    countSuccessfulPurchasesByUser(userId: string): Promise<number>;
    calculateTotalRevenueForInstructor(instructorId: string): Promise<number>;
    getUserPurchasedCourses(userId: string): Promise<any[]>;
    initiateCheckout(userId: string, checkoutDto: CheckoutDto, courseIds: string[], totalAmount: number, isCartPayment: boolean, discountCodeId?: string, discountAmount?: number): Promise<{
        success: boolean;
        payment: any;
        paymentUrl: string;
        message: string;
    } | {
        success: boolean;
        payment: any;
        message: string;
    }>;
    processWebhook(webhookData: any): Promise<void>;
}
