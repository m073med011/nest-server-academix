import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
export declare class PaymentsRepository {
    private paymentModel;
    constructor(paymentModel: Model<PaymentDocument>);
    create(createPaymentDto: any): Promise<Payment>;
    findAll(): Promise<Payment[]>;
    findById(id: string): Promise<Payment | null>;
    update(id: string, updatePaymentDto: any): Promise<Payment | null>;
    delete(id: string): Promise<Payment | null>;
    countSuccessfulPurchasesByUser(userId: string): Promise<number>;
    calculateTotalRevenueForInstructor(instructorId: string): Promise<number>;
    findPurchasedCoursesByUser(userId: string): Promise<any[]>;
}
