import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserDocument } from './schemas/user.schema';
import { OrganizationMembershipRepository } from '../organizations/organization-membership.repository';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  SwitchContextDto,
} from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly membershipRepository: OrganizationMembershipRepository,
  ) {}

  async create(user: any): Promise<UserDocument> {
    return this.usersRepository.create(user);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findOne({ email });
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findByEmailWithPassword(email);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.usersRepository.findById(id);
  }

  async update(id: string, updateData: any): Promise<UserDocument> {
    const updatedUser = await this.usersRepository.update(
      { _id: id },
      updateData,
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = newPassword;
    await user.save();
  }

  async searchUsers(email: string, currentUserId: string) {
    const users = await this.usersRepository.searchByEmail(email);
    return users.filter((user) => user._id.toString() !== currentUserId);
  }

  async getProfile(userId: string) {
    const user =
      await this.usersRepository.findByIdWithPopulatedCourses(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return this.update(userId, updateProfileDto);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findByIdWithPassword(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await user.matchPassword(changePasswordDto.currentPassword);
    if (!isMatch) {
      throw new BadRequestException('Incorrect current password');
    }

    user.password = changePasswordDto.newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async getMyOrganizations(userId: string) {
    return this.membershipRepository.findByUser(userId);
  }

  async switchContext(userId: string, switchContextDto: SwitchContextDto) {
    const membership = await this.membershipRepository.findOne({
      userId,
      organizationId: switchContextDto.organizationId,
      status: 'active',
    });

    if (!membership) {
      throw new BadRequestException(
        'User is not an active member of this organization',
      );
    }

    const updatedUser = await this.usersRepository.update(
      { _id: userId },
      { lastActiveOrganization: switchContextDto.organizationId },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Context switched successfully',
      activeOrganizationId: switchContextDto.organizationId,
      activeOrganization: updatedUser.lastActiveOrganization,
    };
  }
}
