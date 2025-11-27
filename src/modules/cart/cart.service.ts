import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  create(userId: string) {
    return this.cartRepository.create(userId);
  }

  findByUserId(userId: string) {
    return this.cartRepository.findByUserId(userId);
  }

  addItem(userId: string, courseId: string) {
    return this.cartRepository.addItem(userId, courseId);
  }

  removeItem(userId: string, courseId: string) {
    return this.cartRepository.removeItem(userId, courseId);
  }

  removeMultipleItems(userId: string, courseIds: string[]) {
    return this.cartRepository.removeMultipleItems(userId, courseIds);
  }

  clearCart(userId: string) {
    return this.cartRepository.clearCart(userId);
  }

  remove(userId: string) {
    return this.cartRepository.delete(userId);
  }
}
