import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type OrganizationMembershipDocument = HydratedDocument<OrganizationMembership>;
export declare enum MembershipStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    LEFT = "left"
}
export declare class OrganizationMembership {
    userId: Types.ObjectId;
    organizationId: Types.ObjectId;
    roleId: Types.ObjectId;
    levelId?: Types.ObjectId;
    termId?: Types.ObjectId;
    status: MembershipStatus;
    joinedAt: Date;
    leftAt?: Date;
}
export declare const OrganizationMembershipSchema: MongooseSchema<OrganizationMembership, import("mongoose").Model<OrganizationMembership, any, any, any, import("mongoose").Document<unknown, any, OrganizationMembership, any, {}> & OrganizationMembership & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrganizationMembership, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<OrganizationMembership>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<OrganizationMembership> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
