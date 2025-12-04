import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, CourseFilterDto, AddEditorDto } from './dto/courses.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto, req: any): Promise<import("./schemas/course.schema").Course>;
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
    getUserPurchasedCourses(req: any): Promise<{
        success: boolean;
        data: any[];
        totalCount: number;
    }>;
    getByInstructor(instructorId: string): Promise<import("./schemas/course.schema").Course[]>;
    findOne(id: string): Promise<import("./schemas/course.schema").Course>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<import("./schemas/course.schema").Course>;
    remove(id: string): Promise<{
        message: string;
    }>;
    enroll(id: string, req: any): Promise<{
        message: string;
        data: import("./schemas/course.schema").Course;
    }>;
    unenroll(id: string, req: any): Promise<{
        message: string;
        data: import("./schemas/course.schema").Course;
    }>;
    addEditor(id: string, addEditorDto: AddEditorDto): Promise<{
        message: string;
        data: import("./schemas/course.schema").Course;
    }>;
    removeEditor(id: string, editorId: string): Promise<{
        message: string;
        data: import("./schemas/course.schema").Course;
    }>;
}
