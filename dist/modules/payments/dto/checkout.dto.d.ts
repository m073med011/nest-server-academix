import { PaymentMethod } from '../schemas/payment.schema';
export declare class BillingDataDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    apartment?: string;
    floor?: string;
    street?: string;
    building?: string;
    shippingMethod?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    state?: string;
}
export declare class CheckoutDto {
    cartId?: string;
    courseId?: string;
    paymentMethod: PaymentMethod;
    billingData: BillingDataDto;
    discountCode?: string;
}
export declare class CheckoutResponseDto {
    success: boolean;
    payment: any;
    paymentUrl?: string;
    message: string;
}
