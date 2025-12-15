import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export declare enum CourseLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert"
}
export type CourseDocument = Course & Document;
export declare enum EnrollmentType {
    FREE = "free",
    SUBSCRIPTION = "subscription",
    ONE_TIME_PURCHASE = "one-time-purchase",
    ORG_SUBSCRIPTION = "org-subscription"
}
export declare enum CourseType {
    FREELANCING = "freelancing",
    ORGANIZATION = "organization"
}
export declare enum ModuleItemType {
    LESSON = "lesson",
    QUIZ = "quiz",
    FILE = "file",
    IMAGE = "image",
    RESOURCE = "resource",
    ASSIGNMENT = "assignment"
}
export declare enum LessonType {
    TEXT = "text",
    VIDEO = "video"
}
export declare class ModuleItem {
    materialId: any;
    order: number;
}
export declare const ModuleItemSchema: MongooseSchema<ModuleItem, import("mongoose").Model<ModuleItem, any, any, any, Document<unknown, any, ModuleItem, any, {}> & ModuleItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ModuleItem, Document<unknown, {}, import("mongoose").FlatRecord<ModuleItem>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ModuleItem> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Module {
    title: string;
    items: ModuleItem[];
}
export declare const ModuleSchema: MongooseSchema<Module, import("mongoose").Model<Module, any, any, any, Document<unknown, any, Module, any, {}> & Module & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Module, Document<unknown, {}, import("mongoose").FlatRecord<Module>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Module> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Course {
    title: string;
    description: string;
    instructor: User;
    editors: User[];
    price: number;
    duration: number;
    level: CourseLevel;
    category: string;
    thumbnailUrl: string;
    isPublished: boolean;
    students: User[];
    rating: number;
    modules: Module[];
    enrollmentType: EnrollmentType;
    courseType: CourseType;
    hasAccessRestrictions: boolean;
    enrollmentCap: number;
    organizationId?: any;
    isOrgPrivate: boolean;
    termId?: any;
    currency: string;
    promoVideoUrl?: string;
    brandColor: string;
    enrollmentStartDate?: Date;
    enrollmentEndDate?: Date;
}
export declare const CourseSchema: MongooseSchema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course, any, {}> & Course & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Course> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
