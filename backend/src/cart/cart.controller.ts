import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart') // route goc la http://localhost:3000/cart
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Query('userId') userId: string) {
    try {
      if (!userId) {
        throw new HttpException('userId là bắt buộc', HttpStatus.BAD_REQUEST);
      }
      return await this.cartService.getCartItem(Number(userId));
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Lỗi khi lấy giỏ hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add')
  async addToCart(@Body() body: { userId: number; productId: number; quantity: number }) {
    try {
      // Validate input
      if (!body.userId || !body.productId || body.quantity === undefined) {
        throw new HttpException(
          'userId, productId và quantity là bắt buộc',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.cartService.addToCart(body.userId, body.productId, body.quantity);
    } catch (error: any) {
      // If it's already an HttpException, rethrow it
      if (error.status) {
        throw error;
      }
      // Otherwise, wrap it
      throw new HttpException(
        error.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':productId') // nhap id san pham can xoa
  async removeCartItem(
    @Param('productId') productId: string,
    @Query('userId') userId: string,
  ) {
    try {
      if (!userId) {
        throw new HttpException('userId là bắt buộc', HttpStatus.BAD_REQUEST);
      }
      return await this.cartService.removeCartItem(Number(userId), Number(productId));
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Lỗi khi xóa sản phẩm',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  async clearCart(@Query('userId') userId: string) {
    try {
      if (!userId) {
        throw new HttpException('userId là bắt buộc', HttpStatus.BAD_REQUEST);
      }
      return await this.cartService.clearCart(Number(userId));
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Lỗi khi xóa giỏ hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
