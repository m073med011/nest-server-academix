"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const organization_membership_repository_1 = require("../organizations/organization-membership.repository");
const organizations_service_1 = require("../organizations/organizations.service");
let UsersService = class UsersService {
    usersRepository;
    membershipRepository;
    organizationsService;
    constructor(usersRepository, membershipRepository, organizationsService) {
        this.usersRepository = usersRepository;
        this.membershipRepository = membershipRepository;
        this.organizationsService = organizationsService;
    }
    async create(user) {
        return this.usersRepository.create(user);
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ email });
    }
    async findByEmailWithPassword(email) {
        return this.usersRepository.findByEmailWithPassword(email);
    }
    async findById(id) {
        return this.usersRepository.findById(id);
    }
    async update(id, updateData) {
        const updatedUser = await this.usersRepository.update({ _id: id }, updateData);
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async updatePassword(id, newPassword) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.password = newPassword;
        await user.save();
    }
    async searchUsers(email, currentUserId) {
        const users = await this.usersRepository.searchByEmail(email);
        return users.filter((user) => user._id.toString() !== currentUserId);
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findByIdWithPopulatedCourses(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(userId, updateProfileDto) {
        return this.update(userId, updateProfileDto);
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.usersRepository.findByIdWithPassword(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isMatch = await user.matchPassword(changePasswordDto.currentPassword);
        if (!isMatch) {
            throw new common_1.BadRequestException('Incorrect current password');
        }
        user.password = changePasswordDto.newPassword;
        await user.save();
        return { message: 'Password updated successfully' };
    }
    async getMyOrganizations(userId) {
        const memberships = await this.membershipRepository.findByUser(userId);
        return Promise.all(memberships.map(async (membership) => {
            const memObj = membership.toObject();
            if (memObj.organizationId && typeof memObj.organizationId === 'object') {
                memObj.organizationId = await this.organizationsService.enrichOrganizationWithCounts(memObj.organizationId);
            }
            return memObj;
        }));
    }
    async deleteAccount(userId) {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isDeleted = await this.usersRepository.delete({ _id: userId });
        if (!isDeleted) {
            throw new common_1.BadRequestException('Failed to delete account');
        }
        return { message: 'Account deleted successfully' };
    }
    async disableAccount(userId) {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = false;
        await user.save();
        return { message: 'Account disabled successfully' };
    }
    async reactivateAccount(userId) {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = true;
        await user.save();
        return { message: 'Account reactivated successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => organizations_service_1.OrganizationsService))),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        organization_membership_repository_1.OrganizationMembershipRepository,
        organizations_service_1.OrganizationsService])
], UsersService);
//# sourceMappingURL=users.service.js.map