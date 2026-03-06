import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { Repository } from 'typeorm';
import { Order } from './orders/entities/order.entity';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'Kết nối thành công!',
      user: 'Trần Tuấn Đăng',
      role: 'Admin',
    };
  }

  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async getStats() {
    const totalProducts = await this.productRepo.count();
    const totalOrders = await this.orderRepo.count();

    const pending = await this.orderRepo.count({ where: { status: 'pending' } });
    const processing = await this.orderRepo.count({ where: { status: 'processing' } });
    const shipped = await this.orderRepo.count({ where: { status: 'shipped' } });
    const completed = await this.orderRepo.count({ where: { status: 'completed' } });
    const cancelled = await this.orderRepo.count({ where: { status: 'cancelled' } });

    const finishedOrders = await this.orderRepo.find({ where: { status: 'completed' } });
    const totalRevenue = finishedOrders.reduce((sum, order) => {
      return sum + Number(order.total_price);
    }, 0);

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      pending,
      processing,
      shipped,
      completed,
      cancelled,
    };
  }
}
