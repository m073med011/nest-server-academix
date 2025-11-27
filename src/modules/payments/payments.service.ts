import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  create(createPaymentDto: any) {
    return this.paymentsRepository.create(createPaymentDto);
  }

  findAll() {
    return this.paymentsRepository.findAll();
  }

  findOne(id: string) {
    return this.paymentsRepository.findById(id);
  }

  update(id: string, updatePaymentDto: any) {
    return this.paymentsRepository.update(id, updatePaymentDto);
  }

  remove(id: string) {
    return this.paymentsRepository.delete(id);
  }

  countSuccessfulPurchasesByUser(userId: string) {
    return this.paymentsRepository.countSuccessfulPurchasesByUser(userId);
  }

  calculateTotalRevenueForInstructor(instructorId: string) {
    return this.paymentsRepository.calculateTotalRevenueForInstructor(
      instructorId,
    );
  }

  getUserPurchasedCourses(userId: string) {
    return this.paymentsRepository.findPurchasedCoursesByUser(userId);
  }
}
