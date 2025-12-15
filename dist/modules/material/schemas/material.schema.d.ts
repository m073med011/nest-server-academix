import { Document, Schema as MongooseSchema } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema';
export declare enum MaterialType {
    VIDEO = "video",
    PDF = "pdf",
    LINK = "link",
    TEXT = "text",
    QUIZ = "quiz",
    ASSIGNMENT = "assignment"
}
export type MaterialDocument = Material & Document;
export declare class Material {
    courseId: Course;
    title: string;
    description: string;
    type: MaterialType;
    content: string;
    url: string;
    order: number;
    duration: number;
    isPublished: boolean;
    isFreePreview: boolean;
    allowDownloads: boolean;
    points: number;
    dueDate: Date;
    submissionTypes: string[];
    allowLate: boolean;
    openInNewTab: boolean;
    moduleId: string;
}
export declare const MaterialSchema: MongooseSchema<Material, import("mongoose").Model<Material, any, any, any, Document<unknown, any, Material, any, {}> & Material & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Material, Document<unknown, {}, import("mongoose").FlatRecord<Material>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Material> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
