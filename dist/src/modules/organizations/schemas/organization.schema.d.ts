import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type OrganizationDocument = Organization & Document;
export declare class OrganizationSettings {
    allowMultipleLevels: boolean;
    requireTermAssignment: boolean;
    allowStudentSelfEnroll: boolean;
}
export declare class Organization {
    name: string;
    description: string;
    owner: User;
    settings: OrganizationSettings;
}
export declare const OrganizationSchema: MongooseSchema<Organization, import("mongoose").Model<Organization, any, any, any, Document<unknown, any, Organization, any, {}> & Organization & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Organization, Document<unknown, {}, import("mongoose").FlatRecord<Organization>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Organization> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
