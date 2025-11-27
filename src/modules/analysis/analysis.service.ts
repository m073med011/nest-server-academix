import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
  ) {}

  async getInstructorAnalysisSummary(instructorId: string) {
    const instructor = await this.usersService.findById(instructorId);
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    const [ownCourseCount, purchasedCourseCount, totalRevenue, totalStudents] =
      await Promise.all([
        this.coursesService.countByInstructor(instructorId),
        this.paymentsService.countSuccessfulPurchasesByUser(instructorId),
        this.paymentsService.calculateTotalRevenueForInstructor(instructorId),
        this.coursesService.countDistinctStudentsForInstructor(instructorId),
      ]);

    return {
      instructorId,
      instructorName: instructor.name,
      ownCourseCount,
      purchasedCourseCount,
      totalRevenue,
      totalStudents,
    };
  }
}
