import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Course } from '../../courses/schemas/course.schema';
import { Organization } from '../../organizations/schemas/organization.schema';
export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    EXCUSED = "excused"
}
export type AttendanceDocument = Attendance & Document;
export declare class Attendance {
    userId: User;
    courseId: Course;
    materialId: any;
    organizationId: Organization;
    status: AttendanceStatus;
    recordedBy: User;
    notes: string;
    recordedAt: Date;
}
export declare const AttendanceSchema: MongooseSchema<Attendance, import("mongoose").Model<Attendance, any, any, any, Document<unknown, any, Attendance, any, {}> & Attendance & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Attendance, Document<unknown, {}, import("mongoose").FlatRecord<Attendance>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Attendance> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
