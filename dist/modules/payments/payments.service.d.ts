import { PaymentsRepository } from './payments.repository';
export declare class PaymentsService {
    private readonly paymentsRepository;
    constructor(paymentsRepository: PaymentsRepository);
    create(createPaymentDto: any): Promise<import("./schemas/payment.schema").Payment>;
    findAll(): Promise<import("./schemas/payment.schema").Payment[]>;
    findOne(id: string): Promise<import("./schemas/payment.schema").Payment | null>;
    update(id: string, updatePaymentDto: any): Promise<import("./schemas/payment.schema").Payment | null>;
    remove(id: string): Promise<import("./schemas/payment.schema").Payment | null>;
    countSuccessfulPurchasesByUser(userId: string): Promise<number>;
    calculateTotalRevenueForInstructor(instructorId: string): Promise<number>;
    getUserPurchasedCourses(userId: string): Promise<any[]>;
}
