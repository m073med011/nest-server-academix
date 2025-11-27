import { ConfigService } from '@nestjs/config';
import { PaymentMethod, BillingData } from './schemas/payment.schema';
export interface PaymobAuthResponse {
    token: string;
}
export interface PaymobOrderResponse {
    id: number;
    created_at: string;
    delivery_needed: boolean;
    merchant: {
        id: number;
        created_at: string;
        phones: string[];
        company_emails: string[];
        company_name: string;
        state: string;
        country: string;
        city: string;
        postal_code: string;
        street: string;
    };
    collector: any;
    amount_cents: number;
    shipping_data: any;
    currency: string;
    is_payment_locked: boolean;
    is_return: boolean;
    is_cancel: boolean;
    is_returned: boolean;
    is_canceled: boolean;
    merchant_order_id: string;
    wallet_notification: any;
    paid_amount_cents: number;
    notify_user_with_email: boolean;
    items: any[];
    order_url: string;
    commission_fees: number;
    delivery_fees_cents: number;
    delivery_vat_cents: number;
    payment_method: string;
    merchant_staff_tag: any;
    api_source: string;
    data: any;
}
export interface PaymobPaymentKeyResponse {
    token: string;
}
export interface CreatePaymentRequest {
    amount: number;
    currency: string;
    merchantOrderId: string;
    billingData: BillingData;
    paymentMethod: PaymentMethod;
}
export declare class PaymobService {
    private readonly configService;
    private apiKey;
    private cardIntegrationId;
    private baseUrl;
    private readonly logger;
    constructor(configService: ConfigService);
    authenticate(): Promise<string>;
    createOrder(authToken: string, amountCents: number, merchantOrderId: string): Promise<PaymobOrderResponse>;
    createPaymentKey(authToken: string, orderId: number, amountCents: number, billingData: BillingData, paymentMethod: PaymentMethod, paymentId: string): Promise<string>;
    processPayment(request: CreatePaymentRequest, paymentId: string): Promise<{
        paymentToken: string;
        orderId: number;
        iframeUrl: string;
    }>;
    verifyWebhookSignature(data: any, signature: string): boolean;
}
