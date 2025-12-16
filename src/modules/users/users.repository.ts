import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findOne(
    filter: FilterQuery<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne(filter).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async find(filter: FilterQuery<UserDocument>): Promise<UserDocument[]> {
    return this.userModel.find(filter).exec();
  }

  async update(
    filter: FilterQuery<UserDocument>,
    update: UpdateQuery<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate(filter, update, { new: true })
      .exec();
  }

  async delete(filter: FilterQuery<UserDocument>): Promise<boolean> {
    const result = await this.userModel.deleteOne(filter).exec();
    return result.deletedCount > 0;
  }

  async searchByEmail(email: string): Promise<UserDocument[]> {
    return this.userModel
      .find({ email: { $regex: email, $options: 'i' } })
      .select('-password')
      .exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByIdWithPassword(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+password').exec();
  }

  async findByIdWithPopulatedCourses(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).populate('purchasedCourses').exec();
  }
}
