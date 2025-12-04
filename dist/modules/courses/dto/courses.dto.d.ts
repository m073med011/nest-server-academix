export declare enum CourseLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export declare class CreateCourseDto {
    title: string;
    description: string;
    thumbnailUrl?: string;
    level: CourseLevel;
    category: string;
    price: number;
    duration: number;
    tags?: string[];
    isPublished?: boolean;
    organizationId?: string;
    isOrgPrivate?: boolean;
}
export declare class UpdateCourseDto {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    level?: CourseLevel;
    category?: string;
    price?: number;
    tags?: string[];
    isPublished?: boolean;
    isOrgPrivate?: boolean;
}
export declare class CourseFilterDto {
    page?: string;
    limit?: string;
    category?: string;
    level?: CourseLevel;
    search?: string;
}
export declare class AddEditorDto {
    editorId: string;
}
