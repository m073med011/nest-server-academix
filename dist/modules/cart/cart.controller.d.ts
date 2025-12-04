import { CartService } from './cart.service';
import { CoursesService } from '../courses/courses.service';
export declare class CartController {
    private readonly cartService;
    private readonly coursesService;
    constructor(cartService: CartService, coursesService: CoursesService);
    getCart(req: any): Promise<import("./schemas/cart.schema").CartDocument | {
        userId: any;
        items: never[];
    }>;
    addItem(req: any, courseId: string): Promise<import("./schemas/cart.schema").CartDocument>;
    removeItem(req: any, courseId: string): Promise<import("./schemas/cart.schema").CartDocument | null>;
    removeMultipleItems(req: any, courseIds: string[]): Promise<import("./schemas/cart.schema").CartDocument | null>;
    clearCart(req: any): Promise<import("./schemas/cart.schema").CartDocument | null>;
}
