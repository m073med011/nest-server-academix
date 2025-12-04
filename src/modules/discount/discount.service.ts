import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { DiscountRepository } from './discount.repository';
import { DiscountType, DiscountValueType, ApplicableOn } from './schemas/discount.schema';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class DiscountService {
  constructor(
    private readonly discountRepository: DiscountRepository,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
  ) {}

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

  /**
   * Validate and calculate discount for cart or single course
   */
  async validateDiscount(code: string, courseIds: string[]): Promise<{
    valid: boolean;
    discount?: any;
    discountAmount: number;
    finalAmount: number;
    message?: string;
  }> {
    // Find discount code
    const discount = await this.discountRepository.findActiveByCode(code);

    if (!discount) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: 0,
        message: 'Invalid or inactive discount code',
      };
    }

    // Check if expired
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: 0,
        message: 'Discount code has expired',
      };
    }

    // Check max uses
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: 0,
        message: 'Discount code has reached maximum usage limit',
      };
    }

    // Check applicability
    const isCartPurchase = courseIds.length > 1;

    if (discount.applicableOn === ApplicableOn.SINGLE_ONLY && isCartPurchase) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: 0,
        message: 'This discount code is only applicable for single course purchases',
      };
    }

    // Course-specific discount validation
    if (discount.type === DiscountType.COURSE_SPECIFIC) {
      if (!discount.courseId || !courseIds.includes(discount.courseId)) {
        return {
          valid: false,
          discountAmount: 0,
          finalAmount: 0,
          message: 'This discount code is not applicable for the selected course(s)',
        };
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const courseId of courseIds) {
      try {
        const course = await this.coursesService.findOne(courseId);
        if (course) {
          totalAmount += course.price || 0;
        }
      } catch (error) {
        // Skip if course not found
        continue;
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.valueType === DiscountValueType.PERCENTAGE) {
      discountAmount = (totalAmount * discount.value) / 100;
    } else if (discount.valueType === DiscountValueType.FIXED) {
      discountAmount = discount.value;
    }

    // Ensure discount doesn't exceed total
    discountAmount = Math.min(discountAmount, totalAmount);
    const finalAmount = Math.max(0, totalAmount - discountAmount);

    return {
      valid: true,
      discount: {
        _id: discount._id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        valueType: discount.valueType,
      },
      discountAmount,
      finalAmount,
      message: 'Discount code applied successfully',
    };
  }

  /**
   * Increment usage count after successful payment
   */
  async incrementUsageCount(discountId: string): Promise<void> {
    const discount = await this.discountRepository.findById(discountId);
    if (discount) {
      await this.discountRepository.update(discountId, {
        usedCount: discount.usedCount + 1,
      });
    }
  }
}
