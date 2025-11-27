import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.findByUserId(req.user.userId);
  }

  @Post('items')
  addItem(@Request() req, @Body('courseId') courseId: string) {
    return this.cartService.addItem(req.user.userId, courseId);
  }

  @Delete('items/:courseId')
  removeItem(@Request() req, @Param('courseId') courseId: string) {
    return this.cartService.removeItem(req.user.userId, courseId);
  }

  @Delete('items')
  removeMultipleItems(@Request() req, @Body('courseIds') courseIds: string[]) {
    return this.cartService.removeMultipleItems(req.user.userId, courseIds);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
