import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentDto: any): Promise<Payment> {
    const newPayment = new this.paymentModel(createPaymentDto);
    return newPayment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentModel.findById(id).exec();
  }

  async update(id: string, updatePaymentDto: any): Promise<Payment | null> {
    return this.paymentModel
      .findByIdAndUpdate(id, updatePaymentDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Payment | null> {
    return this.paymentModel.findByIdAndDelete(id).exec();
  }

  async countSuccessfulPurchasesByUser(userId: string): Promise<number> {
    return this.paymentModel
      .countDocuments({ userId, status: 'success' })
      .exec();
  }

  async calculateTotalRevenueForInstructor(
    instructorId: string,
  ): Promise<number> {
    const result = await this.paymentModel
      .aggregate([
        { $match: { status: 'success' } },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseIds',
            foreignField: '_id',
            as: 'courses',
          },
        },
        { $unwind: '$courses' },
        {
          $match: {
            'courses.instructor': new this.paymentModel.base.Types.ObjectId(
              instructorId,
            ),
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
          },
        },
      ])
      .exec();
    return result[0]?.totalRevenue || 0;
  }

  async findPurchasedCoursesByUser(userId: string): Promise<any[]> {
    const payments = await this.paymentModel
      .find({ userId, status: 'success' })
      .populate('courseIds')
      .exec();

    // Flatten courseIds arrays from all payments
    const courses = payments.flatMap((payment) => payment.courseIds);
    return courses;
  }
}
