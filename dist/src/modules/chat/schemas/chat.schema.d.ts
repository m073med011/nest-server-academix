import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';
export declare enum ChatType {
    PRIVATE = "private",
    COURSE = "course",
    SYSTEM = "system"
}
export type ChatDocument = Chat & Document;
export declare class Chat {
    type: ChatType;
    participants: User[];
    courseId: Course;
    name: string;
    lastMessage: string;
    lastMessageTime: Date;
}
export declare const ChatSchema: MongooseSchema<Chat, import("mongoose").Model<Chat, any, any, any, Document<unknown, any, Chat, any, {}> & Chat & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chat, Document<unknown, {}, import("mongoose").FlatRecord<Chat>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Chat> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
