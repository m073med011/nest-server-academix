import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<import("./schemas/cart.schema").CartDocument | null>;
    addItem(req: any, courseId: string): Promise<import("./schemas/cart.schema").CartDocument>;
    removeItem(req: any, courseId: string): Promise<import("./schemas/cart.schema").CartDocument | null>;
    removeMultipleItems(req: any, courseIds: string[]): Promise<import("./schemas/cart.schema").CartDocument | null>;
    clearCart(req: any): Promise<import("./schemas/cart.schema").CartDocument | null>;
}
