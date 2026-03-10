import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private dataSource: DataSource, // Dung để quản lý transaction khi tạo đơn hàng và order items
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Tạo order chính
      const order = queryRunner.manager.create(Order, {
        customer_name: createOrderDto.customer_name,
        customer_phone: createOrderDto.customer_phone,
        customer_address: createOrderDto.customer_address,
        total_price: createOrderDto.total_price,
        status: 'pending', // Mặc định là pending khi tạo mới
      });
      const savedOrder = await queryRunner.manager.save(order);

      // 2. Tạo danh sach cac mon an trong don hang
      const orderItems = createOrderDto.items.map((item) =>
        queryRunner.manager.create(OrderItem, {
          order_id: savedOrder.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        } as Partial<OrderItem>),
      );

      await queryRunner.manager.save(orderItems);

      // Neu moi thu on, xac nhan luu vao database
      await queryRunner.commitTransaction();
      return { message: 'Đơn hàng đã được đặt thành công', orderId: savedOrder.id };
    } catch (err) {
      // Neu co loi, quay lui ve trang thai ban dau
      await queryRunner.rollbackTransaction();
      throw err; // Ném lỗi để controller có thể xử lý và trả về phản hồi lỗi cho client
    } finally {
      await queryRunner.release(); // Giải phóng query runner sau khi hoàn thành
    }
  }

  // Lay tat ca don hang, chi tiet mon an ( cho admin )
  async findAll() {
    return await this.orderRepository.find({
      relations: ['items', 'items.product'], // Lấy luôn thông tin món ăn liên quan trong mỗi đơn hàng
      order: { created_at: 'DESC' }, // Sắp xếp theo ngày tạo mới nhất
    });
  }

  // Lay chi tiet 1 don hang
  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'], // Lấy luôn thông tin món ăn liên quan trong đơn hàng
    });
  }

  //Cap nhap trang thai don hang ( cho admin )
  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.orderRepository.update(id, updateOrderDto);
    return { message: 'Cập nhật đơn hàng thành công' };
  }

  async remove(id: number) {
    return await this.orderRepository.delete(id);
  }
  // Lay tat ca don hang cua 1 user ( cho user xem lich su don hang )
  async findMyOrders(userId: number) {
    return await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'], // Lấy luôn thông tin món ăn liên quan trong mỗi đơn hàng
      order: { created_at: 'DESC' }, // Sắp xếp theo ngày tạo mới nhất
    });
  }
}
