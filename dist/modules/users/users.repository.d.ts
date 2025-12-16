import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(user: Partial<User>): Promise<UserDocument>;
    findOne(filter: FilterQuery<UserDocument>): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    find(filter: FilterQuery<UserDocument>): Promise<UserDocument[]>;
    update(filter: FilterQuery<UserDocument>, update: UpdateQuery<UserDocument>): Promise<UserDocument | null>;
    delete(filter: FilterQuery<UserDocument>): Promise<boolean>;
    searchByEmail(email: string): Promise<UserDocument[]>;
    findByEmailWithPassword(email: string): Promise<UserDocument | null>;
    findByIdWithPassword(id: string): Promise<UserDocument | null>;
    findByIdWithPopulatedCourses(id: string): Promise<UserDocument | null>;
}
