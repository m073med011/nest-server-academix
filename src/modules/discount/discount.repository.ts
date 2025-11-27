import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Discount,
  DiscountDocument,
  DiscountType,
} from './schemas/discount.schema';

@Injectable()
export class DiscountRepository {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<DiscountDocument>,
  ) {}

  async create(createDiscountDto: any): Promise<DiscountDocument> {
    const newDiscount = new this.discountModel(createDiscountDto);
    return newDiscount.save();
  }

  async findAll(): Promise<DiscountDocument[]> {
    return this.discountModel.find().exec();
  }

  async findById(id: string): Promise<DiscountDocument | null> {
    return this.discountModel.findById(id).exec();
  }

  async findByCode(code: string): Promise<DiscountDocument | null> {
    return this.discountModel.findOne({ code: code.toUpperCase() }).exec();
  }

  async findActiveByCode(code: string): Promise<DiscountDocument | null> {
    return this.discountModel
      .findOne({
        code: code.toUpperCase(),
        isActive: true,
      })
      .exec();
  }

  async findByCreator(
    createdBy: string,
    type?: DiscountType,
  ): Promise<DiscountDocument[]> {
    const query: any = { createdBy };
    if (type) {
      query.type = type;
    }
    return this.discountModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findPlatformWide(): Promise<DiscountDocument[]> {
    return this.discountModel
      .find({ type: DiscountType.PLATFORM_WIDE })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findActivePlatformWide(): Promise<DiscountDocument[]> {
    return this.discountModel
      .find({
        type: DiscountType.PLATFORM_WIDE,
        isActive: true,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCourse(courseId: string): Promise<DiscountDocument[]> {
    return this.discountModel
      .find({
        type: DiscountType.COURSE_SPECIFIC,
        courseId,
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateDiscountDto: any,
  ): Promise<DiscountDocument | null> {
    return this.discountModel
      .findByIdAndUpdate(id, updateDiscountDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<DiscountDocument | null> {
    return this.discountModel.findByIdAndDelete(id).exec();
  }
}
