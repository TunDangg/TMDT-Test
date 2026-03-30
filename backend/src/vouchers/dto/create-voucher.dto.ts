import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';

export enum DiscountType {
  PERCENT = 'percent',
  FIXED = 'fixed',
}

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã voucher không được để trống' })
  code: string;

  @IsEnum(DiscountType)
  discount_type: DiscountType;

  @IsNumber()
  @IsNotEmpty()
  discount_value: number;

  @IsNumber()
  @IsOptional()
  min_order_value?: number;

  @IsNumber()
  @IsOptional()
  max_discount_amount?: number;

  @IsDateString()
  @IsNotEmpty()
  expiry_date: string;

  @IsNumber()
  @IsOptional()
  usage_limit?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
