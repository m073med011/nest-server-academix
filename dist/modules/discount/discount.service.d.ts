import { DiscountRepository } from './discount.repository';
export declare class DiscountService {
    private readonly discountRepository;
    constructor(discountRepository: DiscountRepository);
    create(createDiscountDto: any): Promise<import("./schemas/discount.schema").DiscountDocument>;
    findAll(): Promise<import("./schemas/discount.schema").DiscountDocument[]>;
    findOne(id: string): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    findByCode(code: string): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    update(id: string, updateDiscountDto: any): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
    remove(id: string): Promise<import("./schemas/discount.schema").DiscountDocument | null>;
}
