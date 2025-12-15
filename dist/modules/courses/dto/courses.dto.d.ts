import { CourseLevel, EnrollmentType, CourseType, ModuleItemType, LessonType } from '../schemas/course.schema';
export { CourseLevel, EnrollmentType, CourseType, ModuleItemType, LessonType };
export declare class ModuleItemDto {
    materialId: string;
    order?: number;
}
export declare class ModuleDto {
    title: string;
    items: ModuleItemDto[];
}
export declare class CreateCourseDto {
    title: string;
    description: string;
    category: string;
    level: CourseLevel;
    thumbnailUrl?: string;
    price: number;
    duration: number;
    modules?: ModuleDto[];
    enrollmentType?: EnrollmentType;
    courseType?: CourseType;
    hasAccessRestrictions?: boolean;
    enrollmentCap?: number;
    tags?: string[];
    isPublished?: boolean;
    organizationId?: string;
    isOrgPrivate?: boolean;
    currency?: string;
    promoVideoUrl?: string;
    brandColor?: string;
    enrollmentStartDate?: string;
    enrollmentEndDate?: string;
}
export declare class UpdateCourseDto {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    level?: CourseLevel;
    category?: string;
    price?: number;
    modules?: ModuleDto[];
    enrollmentType?: EnrollmentType;
    courseType?: CourseType;
    hasAccessRestrictions?: boolean;
    enrollmentCap?: number;
    tags?: string[];
    isPublished?: boolean;
    isOrgPrivate?: boolean;
    currency?: string;
    promoVideoUrl?: string;
    brandColor?: string;
    enrollmentStartDate?: string;
    enrollmentEndDate?: string;
}
export declare class CourseFilterDto {
    page?: string;
    limit?: string;
    category?: string;
    level?: CourseLevel;
    search?: string;
    sort?: string;
}
export declare class AddEditorDto {
    editorId: string;
}
