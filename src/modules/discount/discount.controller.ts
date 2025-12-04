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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create discount code' })
  create(@Body() createDiscountDto: any) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all discount codes' })
  findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get discount by ID' })
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(id);
  }

  @Get('code/:code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get discount by code' })
  findByCode(@Param('code') code: string) {
    return this.discountService.findByCode(code);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate discount code and calculate discount (public endpoint)' })
  async validateDiscount(
    @Body() validateDto: { code: string; courseIds: string[] },
  ) {
    return this.discountService.validateDiscount(
      validateDto.code,
      validateDto.courseIds,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update discount code' })
  update(@Param('id') id: string, @Body() updateDiscountDto: any) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete discount code' })
  remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }
}
