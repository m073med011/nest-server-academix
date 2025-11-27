import { CoursesService } from '../courses/courses.service';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';
export declare class AnalysisService {
    private readonly coursesService;
    private readonly paymentsService;
    private readonly usersService;
    constructor(coursesService: CoursesService, paymentsService: PaymentsService, usersService: UsersService);
    getInstructorAnalysisSummary(instructorId: string): Promise<{
        instructorId: string;
        instructorName: string;
        ownCourseCount: number;
        purchasedCourseCount: number;
        totalRevenue: number;
        totalStudents: number;
    }>;
}
