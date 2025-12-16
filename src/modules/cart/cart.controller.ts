import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CoursesService } from '../courses/courses.service';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
  ) {}

  @Get()
  async getCart(@Request() req) {
    try {
      const userId = req.user._id.toString();
      const cart = await this.cartService.findByUserId(userId);

      if (!cart) {
        return { userId, items: [], itemCount: 0, totalPrice: 0 };
      }

      // Convert to JSON to ensure virtuals are included
      return cart.toJSON();
    } catch (error) {
      throw new BadRequestException('Failed to fetch cart');
    }
  }

  @Post('items')
  async addItem(@Request() req, @Body('courseId') courseId: string) {
    if (!courseId) {
      throw new BadRequestException('Course ID is required');
    }

    // Validate MongoDB ObjectId format
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(courseId)) {
      throw new BadRequestException('Invalid course ID format');
    }

    try {
      const userId = req.user._id.toString();

      // Check if course exists
      const course = await this.coursesService.findOne(courseId);
      if (!course) {
        throw new BadRequestException('Course not found');
      }

      // Check if user already purchased this course
      const students = course.students || [];
      const isPurchased = students.some(
        (student: any) => student.toString() === userId,
      );

      if (isPurchased) {
        throw new BadRequestException(
          'You already own this course. Check your purchased courses.',
        );
      }

      const cart = await this.cartService.addItem(userId, courseId);
      return cart.toJSON();
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to add item to cart');
    }
  }

  @Delete('items/:courseId')
  async removeItem(@Request() req, @Param('courseId') courseId: string) {
    if (!courseId) {
      throw new BadRequestException('Course ID is required');
    }

    try {
      const userId = req.user._id.toString();
      const cart = await this.cartService.removeItem(userId, courseId);
      return cart ? cart.toJSON() : { userId, items: [], itemCount: 0, totalPrice: 0 };
    } catch (error) {
      throw new BadRequestException('Failed to remove item from cart');
    }
  }

  @Delete('items')
  async removeMultipleItems(
    @Request() req,
    @Body('courseIds') courseIds: string[],
  ) {
    if (!courseIds || courseIds.length === 0) {
      throw new BadRequestException('Course IDs are required');
    }

    try {
      const userId = req.user._id.toString();
      const cart = await this.cartService.removeMultipleItems(userId, courseIds);
      return cart ? cart.toJSON() : { userId, items: [], itemCount: 0, totalPrice: 0 };
    } catch (error) {
      throw new BadRequestException('Failed to remove items from cart');
    }
  }

  @Delete()
  async clearCart(@Request() req) {
    try {
      const userId = req.user._id.toString();
      const cart = await this.cartService.clearCart(userId);
      return cart ? cart.toJSON() : { userId, items: [], itemCount: 0, totalPrice: 0 };
    } catch (error) {
      throw new BadRequestException('Failed to clear cart');
    }
  }
}
