import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';
import { Payment } from '../../payments/schemas/payment.schema';
export declare enum InvoiceStatus {
    ISSUED = "issued",
    PAID = "paid",
    VOID = "void",
    CANCELLED = "cancelled"
}
export type InvoiceDocument = Invoice & Document;
export declare class InvoiceItem {
    courseId: Course;
    courseName: string;
    price: number;
    quantity: number;
}
export declare const InvoiceItemSchema: MongooseSchema<InvoiceItem, import("mongoose").Model<InvoiceItem, any, any, any, Document<unknown, any, InvoiceItem, any, {}> & InvoiceItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InvoiceItem, Document<unknown, {}, import("mongoose").FlatRecord<InvoiceItem>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<InvoiceItem> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class BillingData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    country: string;
}
export declare const BillingDataSchema: MongooseSchema<BillingData, import("mongoose").Model<BillingData, any, any, any, Document<unknown, any, BillingData, any, {}> & BillingData & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BillingData, Document<unknown, {}, import("mongoose").FlatRecord<BillingData>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<BillingData> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Invoice {
    invoiceNumber: string;
    paymentId: Payment;
    userId: User;
    courseIds: Course[];
    amount: number;
    currency: string;
    paymentMethod: string;
    billingData: BillingData;
    items: InvoiceItem[];
    subtotal: number;
    discountAmount: number;
    tax: number;
    total: number;
    status: InvoiceStatus;
    issuedAt: Date;
    dueAt: Date;
    paidAt: Date;
}
export declare const InvoiceSchema: MongooseSchema<Invoice, import("mongoose").Model<Invoice, any, any, any, Document<unknown, any, Invoice, any, {}> & Invoice & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invoice, Document<unknown, {}, import("mongoose").FlatRecord<Invoice>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Invoice> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
