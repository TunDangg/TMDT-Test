import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Product])], // cap quyen truy cap vao bang cart_items va products
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
