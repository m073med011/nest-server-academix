import { CartRepository } from './cart.repository';
export declare class CartService {
    private readonly cartRepository;
    constructor(cartRepository: CartRepository);
    create(userId: string): Promise<import("./schemas/cart.schema").CartDocument>;
    findByUserId(userId: string): Promise<import("./schemas/cart.schema").CartDocument | null>;
    addItem(userId: string, courseId: string): Promise<import("./schemas/cart.schema").CartDocument>;
    removeItem(userId: string, courseId: string): Promise<import("./schemas/cart.schema").CartDocument | null>;
    removeMultipleItems(userId: string, courseIds: string[]): Promise<import("./schemas/cart.schema").CartDocument | null>;
    clearCart(userId: string): Promise<import("./schemas/cart.schema").CartDocument | null>;
    remove(userId: string): Promise<import("./schemas/cart.schema").CartDocument | null>;
}
