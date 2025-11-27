import { Document, Schema as MongooseSchema } from 'mongoose';
export type CartDocument = Cart & Document;
export declare class CartItem {
    courseId: string;
    addedAt: Date;
}
export declare const CartItemSchema: MongooseSchema<CartItem, import("mongoose").Model<CartItem, any, any, any, Document<unknown, any, CartItem, any, {}> & CartItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CartItem, Document<unknown, {}, import("mongoose").FlatRecord<CartItem>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CartItem> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Cart {
    userId: string;
    items: CartItem[];
}
export declare const CartSchema: MongooseSchema<Cart, import("mongoose").Model<Cart, any, any, any, Document<unknown, any, Cart, any, {}> & Cart & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, import("mongoose").FlatRecord<Cart>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Cart> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
