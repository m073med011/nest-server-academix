import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  create(createInvoiceDto: any) {
    return this.invoiceRepository.create(createInvoiceDto);
  }

  findAll() {
    return this.invoiceRepository.findAll();
  }

  findOne(id: string) {
    return this.invoiceRepository.findById(id);
  }

  findByUserId(userId: string) {
    return this.invoiceRepository.findByUserId(userId);
  }

  findByInvoiceNumber(invoiceNumber: string) {
    return this.invoiceRepository.findByInvoiceNumber(invoiceNumber);
  }

  update(id: string, updateInvoiceDto: any) {
    return this.invoiceRepository.update(id, updateInvoiceDto);
  }

  remove(id: string) {
    return this.invoiceRepository.delete(id);
  }
}
