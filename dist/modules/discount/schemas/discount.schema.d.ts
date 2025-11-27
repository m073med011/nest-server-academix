import { Document, Schema as MongooseSchema } from 'mongoose';
export declare enum DiscountType {
    PLATFORM_WIDE = "platform_wide",
    COURSE_SPECIFIC = "course_specific"
}
export declare enum DiscountValueType {
    PERCENTAGE = "percentage",
    FIXED = "fixed"
}
export declare enum ApplicableOn {
    SINGLE_ONLY = "single_only",
    BOTH = "both"
}
export type DiscountDocument = Discount & Document;
export declare class Discount {
    code: string;
    type: DiscountType;
    createdBy: string;
    courseId?: string;
    value: number;
    valueType: DiscountValueType;
    applicableOn: ApplicableOn;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
    expiresAt: Date;
}
export declare const DiscountSchema: MongooseSchema<Discount, import("mongoose").Model<Discount, any, any, any, Document<unknown, any, Discount, any, {}> & Discount & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Discount, Document<unknown, {}, import("mongoose").FlatRecord<Discount>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Discount> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
