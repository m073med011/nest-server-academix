import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto, SwitchContextDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    searchUsers(email: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, {}> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, {}> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, {}> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getMyOrganizations(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../organizations/schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("../organizations/schemas/organization-membership.schema").OrganizationMembership & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    switchContext(req: any, switchContextDto: SwitchContextDto): Promise<{
        message: string;
        activeOrganizationId: string;
        activeOrganization: import("mongoose").Types.ObjectId;
    }>;
}
