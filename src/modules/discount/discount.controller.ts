import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('discounts')
@UseGuards(JwtAuthGuard)
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  create(@Body() createDiscountDto: any) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(id);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.discountService.findByCode(code);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: any) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }
}
