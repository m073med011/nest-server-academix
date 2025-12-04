import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DiscountRepository } from './discount.repository';
import { Discount, DiscountSchema } from './schemas/discount.schema';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
    ]),
    forwardRef(() => CoursesModule),
  ],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountRepository],
  exports: [DiscountService, DiscountRepository],
})
export class DiscountModule {}
