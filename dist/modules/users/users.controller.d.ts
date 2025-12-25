import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    searchUsers(email: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, {}> & Omit<import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "matchPassword"> & import("./schemas/user.schema").UserMethods)[]>;
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, {}> & Omit<import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "matchPassword"> & import("./schemas/user.schema").UserMethods>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, {}> & Omit<import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "matchPassword"> & import("./schemas/user.schema").UserMethods>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getMyOrganizations(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../organizations/schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("../organizations/schemas/organization-membership.schema").OrganizationMembership & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
