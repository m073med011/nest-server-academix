import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';
export declare enum PaymentMethod {
    CARD = "card",
    WALLET = "wallet",
    CASH = "cash"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export type PaymentDocument = Payment & Document;
export declare class BillingData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    apartment: string;
    floor: string;
    street: string;
    building: string;
    shippingMethod: string;
    postalCode: string;
    city: string;
    country: string;
    state: string;
}
export declare class Payment {
    userId: User;
    courseId?: Course;
    courseIds: Course[];
    amount: number;
    originalAmount: number;
    discountAmount: number;
    discountCodeId?: any;
    isCartPayment: boolean;
    currency: string;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    paymobOrderId: string;
    paymobTransactionId: string;
    paymobPaymentId: string;
    billingData: BillingData;
}
export declare const PaymentSchema: MongooseSchema<Payment, import("mongoose").Model<Payment, any, any, any, Document<unknown, any, Payment, any, {}> & Payment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payment, Document<unknown, {}, import("mongoose").FlatRecord<Payment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Payment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
