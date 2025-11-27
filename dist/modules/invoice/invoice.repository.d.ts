import { Model } from 'mongoose';
import { InvoiceDocument } from './schemas/invoice.schema';
export declare class InvoiceRepository {
    private invoiceModel;
    constructor(invoiceModel: Model<InvoiceDocument>);
    create(createInvoiceDto: any): Promise<InvoiceDocument>;
    findAll(): Promise<InvoiceDocument[]>;
    findById(id: string): Promise<InvoiceDocument | null>;
    findByUserId(userId: string): Promise<InvoiceDocument[]>;
    findByInvoiceNumber(invoiceNumber: string): Promise<InvoiceDocument | null>;
    update(id: string, updateInvoiceDto: any): Promise<InvoiceDocument | null>;
    delete(id: string): Promise<InvoiceDocument | null>;
}
