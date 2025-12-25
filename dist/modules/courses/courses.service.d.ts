import { CoursesRepository } from './courses.repository';
import { PaymentsService } from '../payments/payments.service';
import { CreateCourseDto, UpdateCourseDto, CourseFilterDto } from './dto/courses.dto';
export declare class CoursesService {
    private readonly coursesRepository;
    private readonly paymentsService;
    constructor(coursesRepository: CoursesRepository, paymentsService: PaymentsService);
    create(createCourseDto: CreateCourseDto, instructorId: string): Promise<import("./schemas/course.schema").Course>;
    findAll(filterDto: CourseFilterDto): Promise<{
        success: boolean;
        data: import("./schemas/course.schema").Course[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasMore: boolean;
        };
    }>;
    findOne(id: string): Promise<import("./schemas/course.schema").Course>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<import("./schemas/course.schema").Course>;
    remove(id: string): Promise<{
        message: string;
    }>;
    enroll(courseId: string, userId: string): Promise<{
        message: string;
        data: import("./schemas/course.schema").Course;
    }>;
    unenroll(courseId: string, userId: string): Promise<{
        message: string;
        data: import("./schemas/course.schema").Course;
    }>;
    getUserPurchasedCourses(userId: string): Promise<{
        success: boolean;
        data: any[];
        totalCount: number;
    }>;
    addEditor(courseId: string, editorId: string): Promise<{
        message: string;
        data: import("./schemas/course.schema").Course;
    }>;
    removeEditor(courseId: string, editorId: string): Promise<{
        message: string;
        data: import("./schemas/course.schema").Course;
    }>;
    findByInstructor(instructorId: string): Promise<import("./schemas/course.schema").Course[]>;
    countByInstructor(instructorId: string): Promise<number>;
    countDistinctStudentsForInstructor(instructorId: string): Promise<number>;
    archiveByOrganization(organizationId: string): Promise<{
        archivedCount: number;
    }>;
    permanentDeleteByOrganization(organizationId: string): Promise<{
        deletedCount: number;
    }>;
}
