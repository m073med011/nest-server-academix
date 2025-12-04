import { DiscountRepository } from './discount.repository';
import { CoursesService } from '../courses/courses.service';
export declare class DiscountService {
    private readonly discountRepository;
    private readonly coursesService;
    constructor(discountRepository: DiscountRepository, coursesService: CoursesService);
    create(createDiscountDto: any): Promise<import("./schemas/discount.schema").DiscountDocument>;
    findAll(): Promise<import("./schemas/discount.schema").DiscountDocument[]>;
    findOne(id: string): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    findByCode(code: string): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    update(id: string, updateDiscountDto: any): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    remove(id: string): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    validateDiscount(code: string, courseIds: string[]): Promise<{
        valid: boolean;
        discount?: any;
        discountAmount: number;
        finalAmount: number;
        message?: string;
    }>;
    incrementUsageCount(discountId: string): Promise<void>;
}
