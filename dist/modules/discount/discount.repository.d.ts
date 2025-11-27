import { Model } from 'mongoose';
import { DiscountDocument, DiscountType } from './schemas/discount.schema';
export declare class DiscountRepository {
    private discountModel;
    constructor(discountModel: Model<DiscountDocument>);
    create(createDiscountDto: any): Promise<DiscountDocument>;
    findAll(): Promise<DiscountDocument[]>;
    findById(id: string): Promise<DiscountDocument | null>;
    findByCode(code: string): Promise<DiscountDocument | null>;
    findActiveByCode(code: string): Promise<DiscountDocument | null>;
    findByCreator(createdBy: string, type?: DiscountType): Promise<DiscountDocument[]>;
    findPlatformWide(): Promise<DiscountDocument[]>;
    findActivePlatformWide(): Promise<DiscountDocument[]>;
    findByCourse(courseId: string): Promise<DiscountDocument[]>;
    update(id: string, updateDiscountDto: any): Promise<DiscountDocument | null>;
    delete(id: string): Promise<DiscountDocument | null>;
}
