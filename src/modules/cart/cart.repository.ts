import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartRepository {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async create(userId: string): Promise<CartDocument> {
    const newCart = new this.cartModel({ userId, items: [] });
    return newCart.save();
  }

  async findByUserId(userId: string): Promise<CartDocument | null> {
    return this.cartModel
      .findOne({ userId })
      .populate({
        path: 'items.courseId',
        model: 'Course',
        select: 'title description price level thumbnail thumbnailUrl duration rating instructor students'
      })
      .exec();
  }

  async addItem(userId: string, courseId: string): Promise<CartDocument> {
    let cart: CartDocument | null = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
      cart = await this.create(userId);
    }

    // TypeScript assertion: cart is now guaranteed to be non-null
    if (!cart) {
      throw new Error('Failed to create or find cart');
    }

    // Check if course already exists (compare as strings)
    const exists = cart.items.some(
      (item) => item.courseId.toString() === courseId
    );

    if (!exists) {
      cart.items.push({ courseId, addedDate: new Date() } as any);
      await cart.save();
    }

    // Re-query with population
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

  async removeItem(
    userId: string,
    courseId: string,
  ): Promise<CartDocument | null> {
    const cart = await this.cartModel.findOne({ userId }).exec();

    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.courseId.toString() !== courseId
      );
      await cart.save();

      // Re-populate
      return this.findByUserId(userId);
    }

    return cart;
  }

  async removeMultipleItems(
    userId: string,
    courseIds: string[],
  ): Promise<CartDocument | null> {
    const cart = await this.cartModel.findOne({ userId }).exec();

    if (cart) {
      cart.items = cart.items.filter(
        (item) => !courseIds.includes(item.courseId.toString())
      );
      await cart.save();

      // Re-populate
      return this.findByUserId(userId);
    }

    return cart;
  }

  async clearCart(userId: string): Promise<CartDocument | null> {
    const cart = await this.findByUserId(userId);
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return cart;
  }

  async delete(userId: string): Promise<CartDocument | null> {
    return this.cartModel.findOneAndDelete({ userId }).exec();
  }
}
