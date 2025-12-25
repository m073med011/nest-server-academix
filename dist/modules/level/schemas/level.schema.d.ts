import { Document, Schema as MongooseSchema } from 'mongoose';
import { Organization } from '../../organizations/schemas/organization.schema';
export type LevelDocument = Level & Document;
export declare class Level {
    name: string;
    description: string;
    organizationId: Organization;
    order: number;
    terms: MongooseSchema.Types.ObjectId[];
}
export declare const LevelSchema: MongooseSchema<Level, import("mongoose").Model<Level, any, any, any, Document<unknown, any, Level, any, {}> & Level & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Level, Document<unknown, {}, import("mongoose").FlatRecord<Level>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Level> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
