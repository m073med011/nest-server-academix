import { CoursesRepository } from './courses.repository';
import { PaymentsService } from '../payments/payments.service';
import { Course } from './schemas/course.schema';
import { CreateCourseDto, UpdateCourseDto, CourseFilterDto } from './dto/courses.dto';
export declare class CoursesService {
    private readonly coursesRepository;
    private readonly paymentsService;
    constructor(coursesRepository: CoursesRepository, paymentsService: PaymentsService);
    create(createCourseDto: CreateCourseDto, instructorId: string): Promise<Course>;
    findAll(filterDto: CourseFilterDto): Promise<{
        success: boolean;
        data: Course[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasMore: boolean;
        };
    }>;
    findOne(id: string): Promise<Course>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course>;
    remove(id: string): Promise<{
        message: string;
    }>;
    enroll(courseId: string, userId: string): Promise<{
        message: string;
        data: Course;
    }>;
    unenroll(courseId: string, userId: string): Promise<{
        message: string;
        data: Course;
    }>;
    getUserPurchasedCourses(userId: string): Promise<{
        success: boolean;
        data: any[];
        totalCount: number;
    }>;
    addEditor(courseId: string, editorId: string): Promise<{
        message: string;
        data: Course;
    }>;
    removeEditor(courseId: string, editorId: string): Promise<{
        message: string;
        data: Course;
    }>;
    findByInstructor(instructorId: string): Promise<Course[]>;
    countByInstructor(instructorId: string): Promise<number>;
    countDistinctStudentsForInstructor(instructorId: string): Promise<number>;
    archiveByOrganization(organizationId: string): Promise<{
        archivedCount: number;
    }>;
    permanentDeleteByOrganization(organizationId: string): Promise<{
        deletedCount: number;
    }>;
    assignCoursesToOrganization(courseIds: string[], organizationId: string): Promise<{
        message: string;
        modifiedCount: number;
    }>;
}
