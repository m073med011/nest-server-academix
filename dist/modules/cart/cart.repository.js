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
exports.CartRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("./schemas/cart.schema");
let CartRepository = class CartRepository {
    cartModel;
    constructor(cartModel) {
        this.cartModel = cartModel;
    }
    async create(userId) {
        const newCart = new this.cartModel({ userId, items: [] });
        return newCart.save();
    }
    async findByUserId(userId) {
        return this.cartModel
            .findOne({ userId })
            .populate({
            path: 'items.courseId',
            model: 'Course',
            select: 'title description price level thumbnail thumbnailUrl duration rating instructor students'
        })
            .exec();
    }
    async addItem(userId, courseId) {
        let cart = await this.cartModel.findOne({ userId }).exec();
        if (!cart) {
            cart = await this.create(userId);
        }
        if (!cart) {
            throw new Error('Failed to create or find cart');
        }
        const exists = cart.items.some((item) => item.courseId.toString() === courseId);
        if (!exists) {
            cart.items.push({ courseId, addedDate: new Date() });
            await cart.save();
        }
        const populatedCart = await this.cartModel
            .findOne({ userId })
            .populate({
            path: 'items.courseId',
            model: 'Course',
            select: 'title description price level thumbnail thumbnailUrl duration rating instructor students'
        })
            .exec();
        if (!populatedCart) {
            throw new Error('Cart not found after creation');
        }
        return populatedCart;
    }
    async removeItem(userId, courseId) {
        const cart = await this.cartModel.findOne({ userId }).exec();
        if (cart) {
            cart.items = cart.items.filter((item) => item.courseId.toString() !== courseId);
            await cart.save();
            return this.findByUserId(userId);
        }
        return cart;
    }
    async removeMultipleItems(userId, courseIds) {
        const cart = await this.cartModel.findOne({ userId }).exec();
        if (cart) {
            cart.items = cart.items.filter((item) => !courseIds.includes(item.courseId.toString()));
            await cart.save();
            return this.findByUserId(userId);
        }
        return cart;
    }
    async clearCart(userId) {
        const cart = await this.findByUserId(userId);
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        return cart;
    }
    async delete(userId) {
        return this.cartModel.findOneAndDelete({ userId }).exec();
    }
};
exports.CartRepository = CartRepository;
exports.CartRepository = CartRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CartRepository);
//# sourceMappingURL=cart.repository.js.map