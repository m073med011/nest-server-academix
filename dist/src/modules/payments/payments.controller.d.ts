import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: any): Promise<import("./schemas/payment.schema").Payment>;
    findAll(): Promise<import("./schemas/payment.schema").Payment[]>;
    findOne(id: string): Promise<import("./schemas/payment.schema").Payment | null>;
    update(id: string, updatePaymentDto: any): Promise<import("./schemas/payment.schema").Payment | null>;
    remove(id: string): Promise<import("./schemas/payment.schema").Payment | null>;
}
