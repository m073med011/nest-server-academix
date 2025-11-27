import { Model } from 'mongoose';
import { CartDocument } from './schemas/cart.schema';
export declare class CartRepository {
    private cartModel;
    constructor(cartModel: Model<CartDocument>);
    create(userId: string): Promise<CartDocument>;
    findByUserId(userId: string): Promise<CartDocument | null>;
    addItem(userId: string, courseId: string): Promise<CartDocument>;
    removeItem(userId: string, courseId: string): Promise<CartDocument | null>;
    removeMultipleItems(userId: string, courseIds: string[]): Promise<CartDocument | null>;
    clearCart(userId: string): Promise<CartDocument | null>;
    delete(userId: string): Promise<CartDocument | null>;
}
