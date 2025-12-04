"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const courses_service_1 = require("../courses/courses.service");
let CartController = class CartController {
    cartService;
    coursesService;
    constructor(cartService, coursesService) {
        this.cartService = cartService;
        this.coursesService = coursesService;
    }
    async getCart(req) {
        try {
            const userId = req.user._id.toString();
            const cart = await this.cartService.findByUserId(userId);
            return cart || { userId, items: [] };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch cart');
        }
    }
    async addItem(req, courseId) {
        if (!courseId) {
            throw new common_1.BadRequestException('Course ID is required');
        }
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        if (!objectIdPattern.test(courseId)) {
            throw new common_1.BadRequestException('Invalid course ID format');
        }
        try {
            const userId = req.user._id.toString();
            const course = await this.coursesService.findOne(courseId);
            if (!course) {
                throw new common_1.BadRequestException('Course not found');
            }
            const students = course.students || [];
            const isPurchased = students.some((student) => student.toString() === userId);
            if (isPurchased) {
                throw new common_1.BadRequestException('You already own this course. Check your purchased courses.');
            }
            return await this.cartService.addItem(userId, courseId);
        }
        catch (error) {
            console.error('Add to cart error:', error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to add item to cart');
        }
    }
    async removeItem(req, courseId) {
        if (!courseId) {
            throw new common_1.BadRequestException('Course ID is required');
        }
        try {
            const userId = req.user._id.toString();
            return await this.cartService.removeItem(userId, courseId);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to remove item from cart');
        }
    }
    async removeMultipleItems(req, courseIds) {
        if (!courseIds || courseIds.length === 0) {
            throw new common_1.BadRequestException('Course IDs are required');
        }
        try {
            const userId = req.user._id.toString();
            return await this.cartService.removeMultipleItems(userId, courseIds);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to remove items from cart');
        }
    }
    async clearCart(req) {
        try {
            const userId = req.user._id.toString();
            return await this.cartService.clearCart(userId);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to clear cart');
        }
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('items'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)('items/:courseId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)('items'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('courseIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeMultipleItems", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => courses_service_1.CoursesService))),
    __metadata("design:paramtypes", [cart_service_1.CartService,
        courses_service_1.CoursesService])
], CartController);
//# sourceMappingURL=cart.controller.js.map