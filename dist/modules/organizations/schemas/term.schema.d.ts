import { HydratedDocument, Types } from 'mongoose';
export type TermDocument = HydratedDocument<Term>;
export declare class Term {
    name: string;
    description: string;
    levelId: Types.ObjectId;
    organizationId: Types.ObjectId;
    startDate: Date;
    endDate: Date;
}
export declare const TermSchema: import("mongoose").Schema<Term, import("mongoose").Model<Term, any, any, any, import("mongoose").Document<unknown, any, Term, any, {}> & Term & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Term, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Term>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Term> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
