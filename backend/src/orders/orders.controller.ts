import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders - Tạo đơn hàng mới
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  // GET /orders - Lấy tất cả đơn hàng
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  // GET /orders/:id - Lấy chi tiết 1 đơn hàng
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // PATCH /orders/:id - Cập nhật trạng thái đơn hàng
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  // DELETE /orders/:id - Xóa đơn hàng
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
