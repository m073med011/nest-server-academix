import { CartService } from './cart.service';
import { CoursesService } from '../courses/courses.service';
export declare class CartController {
    private readonly cartService;
    private readonly coursesService;
    constructor(cartService: CartService, coursesService: CoursesService);
    getCart(req: any): Promise<import("mongoose").FlattenMaps<any>>;
    addItem(req: any, courseId: string): Promise<import("mongoose").FlattenMaps<any>>;
    removeItem(req: any, courseId: string): Promise<import("mongoose").FlattenMaps<any>>;
    removeMultipleItems(req: any, courseIds: string[]): Promise<import("mongoose").FlattenMaps<any>>;
    clearCart(req: any): Promise<import("mongoose").FlattenMaps<any>>;
}
