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
    return this.cartModel.findOne({ userId }).exec();
  }

  async addItem(userId: string, courseId: string): Promise<CartDocument> {
    let cart = await this.findByUserId(userId);
    if (!cart) {
      cart = await this.create(userId);
    }

    const exists = cart.items.some((item) => item.courseId === courseId);
    if (!exists) {
      cart.items.push({ courseId, addedAt: new Date() });
      await cart.save();
    }
    return cart;
  }

  async removeItem(
    userId: string,
    courseId: string,
  ): Promise<CartDocument | null> {
    const cart = await this.findByUserId(userId);
    if (cart) {
      cart.items = cart.items.filter((item) => item.courseId !== courseId);
      await cart.save();
    }
    return cart;
  }

  async removeMultipleItems(
    userId: string,
    courseIds: string[],
  ): Promise<CartDocument | null> {
    const cart = await this.findByUserId(userId);
    if (cart) {
      cart.items = cart.items.filter(
        (item) => !courseIds.includes(item.courseId),
      );
      await cart.save();
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
