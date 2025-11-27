import { InvoiceRepository } from './invoice.repository';
export declare class InvoiceService {
    private readonly invoiceRepository;
    constructor(invoiceRepository: InvoiceRepository);
    create(createInvoiceDto: any): Promise<import("./schemas/invoice.schema").InvoiceDocument>;
    findAll(): Promise<import("./schemas/invoice.schema").InvoiceDocument[]>;
    findOne(id: string): Promise<import("./schemas/invoice.schema").InvoiceDocument | null>;
    findByUserId(userId: string): Promise<import("./schemas/invoice.schema").InvoiceDocument[]>;
    findByInvoiceNumber(invoiceNumber: string): Promise<import("./schemas/invoice.schema").InvoiceDocument | null>;
    update(id: string, updateInvoiceDto: any): Promise<import("./schemas/invoice.schema").InvoiceDocument | null>;
    remove(id: string): Promise<import("./schemas/invoice.schema").InvoiceDocument | null>;
}
