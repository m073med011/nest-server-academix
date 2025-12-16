import { IsString, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../schemas/payment.schema';

export class BillingDataDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  apartment?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  floor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  street?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  building?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shippingMethod?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;
}

export class CheckoutDto {
  @ApiPropertyOptional({ description: 'Cart ID for cart checkout' })
  @IsString()
  @IsOptional()
  cartId?: string;

  @ApiPropertyOptional({ description: 'Course ID for single course purchase' })
  @IsString()
  @IsOptional()
  courseId?: string;

  @ApiProperty({
    enum: PaymentMethod,
    description: 'Payment method: card, wallet, or cash',
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ type: BillingDataDto })
  @ValidateNested()
  @Type(() => BillingDataDto)
  billingData: BillingDataDto;

  @ApiPropertyOptional({ description: 'Discount code to apply' })
  @IsString()
  @IsOptional()
  discountCode?: string;
}

export class CheckoutResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  payment: any; // Will be typed with Payment entity

  @ApiPropertyOptional()
  paymentUrl?: string;

  @ApiProperty()
  message: string;
}
