import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: any) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  findAll(@Request() req) {
    // Optionally filter by user if not admin
    return this.invoiceService.findByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Get('number/:invoiceNumber')
  findByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoiceService.findByInvoiceNumber(invoiceNumber);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: any) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }
}
