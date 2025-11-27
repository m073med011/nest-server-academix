import { DiscountService } from './discount.service';
export declare class DiscountController {
    private readonly discountService;
    constructor(discountService: DiscountService);
    create(createDiscountDto: any): Promise<import("./schemas/discount.schema").DiscountDocument>;
    findAll(): Promise<import("./schemas/discount.schema").DiscountDocument[]>;
    findOne(id: string): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    findByCode(code: string): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    update(id: string, updateDiscountDto: any): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    remove(id: string): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
}
