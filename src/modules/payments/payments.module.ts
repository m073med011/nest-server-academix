import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymobService } from './paymob.service';
import { PaymentsRepository } from './payments.repository';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { CartModule } from '../cart/cart.module';
import { CoursesModule } from '../courses/courses.module';
import { DiscountModule } from '../discount/discount.module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    forwardRef(() => CartModule),
    forwardRef(() => CoursesModule),
    forwardRef(() => DiscountModule),
    forwardRef(() => InvoiceModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository, PaymobService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
