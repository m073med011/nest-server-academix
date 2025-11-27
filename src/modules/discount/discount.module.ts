import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DiscountRepository } from './discount.repository';
import { Discount, DiscountSchema } from './schemas/discount.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
    ]),
  ],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountRepository],
  exports: [DiscountService],
})
export class DiscountModule {}
