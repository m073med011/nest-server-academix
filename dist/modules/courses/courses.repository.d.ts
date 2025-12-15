import { Model, FilterQuery } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
export declare class CoursesRepository {
    private courseModel;
    constructor(courseModel: Model<CourseDocument>);
    create(createCourseDto: any): Promise<Course>;
    findAll(filter?: FilterQuery<CourseDocument>, options?: any): Promise<Course[]>;
    count(filter?: FilterQuery<CourseDocument>): Promise<number>;
    findById(id: string, options?: any): Promise<Course | null>;
    update(id: string, updateCourseDto: any): Promise<Course | null>;
    delete(id: string): Promise<Course | null>;
    countByInstructor(instructorId: string): Promise<number>;
    countDistinctStudentsForInstructor(instructorId: string): Promise<number>;
    addStudent(courseId: string, userId: string): Promise<Course | null>;
    removeStudent(courseId: string, userId: string): Promise<Course | null>;
    addEditor(courseId: string, editorId: string): Promise<Course | null>;
    removeEditor(courseId: string, editorId: string): Promise<Course | null>;
    findByInstructor(instructorId: string): Promise<Course[]>;
}
