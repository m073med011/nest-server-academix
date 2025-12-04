import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export declare enum CourseLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export type CourseDocument = Course & Document;
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
    materials: any[];
    organizationId?: any;
    isOrgPrivate: boolean;
    termId?: any;
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
