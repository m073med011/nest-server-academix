import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';

@Injectable()
export class InvoiceRepository {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create(createInvoiceDto: any): Promise<InvoiceDocument> {
    const newInvoice = new this.invoiceModel(createInvoiceDto);
    return newInvoice.save();
  }

  async findAll(): Promise<InvoiceDocument[]> {
    return this.invoiceModel.find().exec();
  }

  async findById(id: string): Promise<InvoiceDocument | null> {
    return this.invoiceModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<InvoiceDocument[]> {
    return this.invoiceModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findByInvoiceNumber(
    invoiceNumber: string,
  ): Promise<InvoiceDocument | null> {
    return this.invoiceModel.findOne({ invoiceNumber }).exec();
  }

  async update(
    id: string,
    updateInvoiceDto: any,
  ): Promise<InvoiceDocument | null> {
    return this.invoiceModel
      .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<InvoiceDocument | null> {
    return this.invoiceModel.findByIdAndDelete(id).exec();
  }
}
