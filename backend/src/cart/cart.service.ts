import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // 1. Lấy giỏ hàng của người dùng
  async getCartItem() {
    const items = await this.cartRepository.find({
      relations: ['product'], // Lấy luôn thông tin sản phẩm liên quan
    });

    // Map và ensure data integrity
    return items.map(item => {
      if (!item.product) {
        console.error(`Product not found for cart item ${item.id}`);
        return null;
      }

      return {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        description: item.product.description,
        stock_quantity: item.product.stock_quantity,
        image_url: item.product.image_url,
        category: item.product.category,
        quantity: item.quantity,
        cartItemId: item.id,
      };
    }).filter(item => item !== null); // Remove null items
  }

  // 2. Thêm sản phẩm vào giỏ hàng
  async addToCart(productId: number, quantity: number) {
    // Validate input
    if (!productId || quantity === undefined || quantity === null) {
      throw new Error('productId và quantity là bắt buộc');
    }

    // Check product exists
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Check stock
    if (product.stock_quantity !== undefined && product.stock_quantity === 0) {
      throw new Error('Sản phẩm đã hết hàng');
    }

    let cartItem = await this.cartRepository.findOne({
      where: { productId },
      relations: ['product']
    });

    if (cartItem) {
      // Nếu sản phẩm đã có trong giỏ hàng
      const newQuantity = cartItem.quantity + quantity;

      // Check stock limit
      if (product.stock_quantity !== undefined && newQuantity > product.stock_quantity) {
        throw new Error(`Chỉ còn ${product.stock_quantity} sản phẩm trong kho`);
      }

      // If quantity becomes 0 or negative, remove item
      if (newQuantity <= 0) {
        await this.cartRepository.remove(cartItem);
        return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
      }

      cartItem.quantity = newQuantity;
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng
      if (quantity <= 0) {
        throw new Error('Số lượng phải lớn hơn 0');
      }

      if (product.stock_quantity !== undefined && quantity > product.stock_quantity) {
        throw new Error(`Chỉ còn ${product.stock_quantity} sản phẩm trong kho`);
      }

      cartItem = this.cartRepository.create({
        productId,
        quantity
      });
    }

    await this.cartRepository.save(cartItem);
    return { success: true, message: 'Thêm vào giỏ hàng thành công!' };
  }

  // 3. Xóa sản phẩm khỏi giỏ hàng
  async removeCartItem(productId: number) {
    const result = await this.cartRepository.delete({ productId });
    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
    }
    return { success: true, message: 'Xóa sản phẩm khỏi giỏ hàng thành công!' };
  }

  // 4. Xóa sạch giỏ hàng
  async clearCart() {
    await this.cartRepository.clear();
    return { success: true, message: 'Giỏ hàng đã được làm trống!' };
  }
}
