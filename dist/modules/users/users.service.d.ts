import { UsersRepository } from './users.repository';
import { UserDocument } from './schemas/user.schema';
import { OrganizationMembershipRepository } from '../organizations/organization-membership.repository';
import { UpdateProfileDto, ChangePasswordDto, SwitchContextDto } from './dto/users.dto';
export declare class UsersService {
    private readonly usersRepository;
    private readonly membershipRepository;
    constructor(usersRepository: UsersRepository, membershipRepository: OrganizationMembershipRepository);
    create(user: any): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findByEmailWithPassword(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    update(id: string, updateData: any): Promise<UserDocument>;
    updatePassword(id: string, newPassword: string): Promise<void>;
    searchUsers(email: string, currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, {}> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, {}> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, {}> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getMyOrganizations(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../organizations/schemas/organization-membership.schema").OrganizationMembership, {}, {}> & import("../organizations/schemas/organization-membership.schema").OrganizationMembership & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    switchContext(userId: string, switchContextDto: SwitchContextDto): Promise<{
        message: string;
        activeOrganizationId: string;
        activeOrganization: import("mongoose").Types.ObjectId;
    }>;
}
