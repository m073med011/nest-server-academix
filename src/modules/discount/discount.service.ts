import { Injectable } from '@nestjs/common';
import { DiscountRepository } from './discount.repository';

@Injectable()
export class DiscountService {
  constructor(private readonly discountRepository: DiscountRepository) {}

  create(createDiscountDto: any) {
    return this.discountRepository.create(createDiscountDto);
  }

  findAll() {
    return this.discountRepository.findAll();
  }

  findOne(id: string) {
    return this.discountRepository.findById(id);
  }

  findByCode(code: string) {
    return this.discountRepository.findByCode(code);
  }

  update(id: string, updateDiscountDto: any) {
    return this.discountRepository.update(id, updateDiscountDto);
  }

  remove(id: string) {
    return this.discountRepository.delete(id);
  }
}
