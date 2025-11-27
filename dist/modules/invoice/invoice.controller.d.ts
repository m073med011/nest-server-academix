import { InvoiceService } from './invoice.service';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(createInvoiceDto: any): Promise<import("./schemas/invoice.schema").InvoiceDocument>;
    findAll(req: any): Promise<import("./schemas/invoice.schema").InvoiceDocument[]>;
    findOne(id: string): Promise<import("./schemas/invoice.schema").InvoiceDocument | null>;
    findByInvoiceNumber(invoiceNumber: string): Promise<import("./schemas/invoice.schema").InvoiceDocument | null>;
    update(id: string, updateInvoiceDto: any): Promise<import("./schemas/invoice.schema").InvoiceDocument | null>;
    remove(id: string): Promise<import("./schemas/invoice.schema").InvoiceDocument | null>;
}
