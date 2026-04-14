import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { VouchersService } from '../vouchers/vouchers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private dataSource: DataSource, // Dung để quản lý transaction khi tạo đơn hàng và order items
    private vouchersService: VouchersService,
  ) {}
  async create(createOrderDto: CreateOrderDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner(); //
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let finalTotalPrice = createOrderDto.total_price;
      let discountAmount = 0;

      // 1. Kiểm tra mã giảm giá nếu có
      if (createOrderDto.voucher_code) {
        const validationResult = await this.vouchersService.validateVoucher(
          createOrderDto.voucher_code,
          createOrderDto.total_price, // Truyền tổng tiền gốc chưa giảm vào
        );

        discountAmount = validationResult.discount_amount;
        finalTotalPrice = validationResult.final_total;
      }

      // Tạo order
      const order = queryRunner.manager.create(Order, {
        customer_name: createOrderDto.customer_name,
        customer_phone: createOrderDto.customer_phone,
        customer_address: createOrderDto.customer_address,
        note: createOrderDto.note,
        total_price: finalTotalPrice,
        voucher_code: createOrderDto.voucher_code || undefined,
        discount_amount: discountAmount,
        status: 'pending', // Mặc định là pending khi tạo mới
        user: { id: userId },
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

      //3. Tăng số lượt sử dụng voucher nếu có
      if (createOrderDto.voucher_code) {
        await this.vouchersService.incrementUsedcount(createOrderDto.voucher_code);
      }

      // Neu moi thu on, xac nhan luu vao database
      await queryRunner.commitTransaction();
      return {
        message: 'Đơn hàng đã được đặt thành công',
        orderId: savedOrder.id,
      };
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
