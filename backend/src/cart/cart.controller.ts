import { Controller, Get, Post, Body, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart') // route goc la http://localhost:3000/cart
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart() {
    try {
      return await this.cartService.getCartItem();
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi khi lấy giỏ hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add')
  async addToCart(@Body() body: { productId: number; quantity: number }) {
    try {
      // Validate input
      if (!body.productId || body.quantity === undefined) {
        throw new HttpException(
          'productId và quantity là bắt buộc',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.cartService.addToCart(body.productId, body.quantity);
    } catch (error) {
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
  async removeCartItem(@Param('productId') productId: number) {
    try {
      return await this.cartService.removeCartItem(Number(productId));
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi khi xóa sản phẩm',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  async clearCart() {
    try {
      return await this.cartService.clearCart();
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi khi xóa giỏ hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
