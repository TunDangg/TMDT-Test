import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders - Tạo đơn hàng mới
  @UseGuards(AuthGuard)
  @Post()
  async create( @Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.sub;
    return this.ordersService.create(createOrderDto, userId);
  }

  // GET /orders - Lấy tất cả đơn hàng
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard) // Chỉ cho phép người dùng đã đăng nhập mới có quyền xem đơn hàng của mình
  @Get('my-orders')
  async findMyOrders(@Request() req) {
    const userId = req.user.sub; // Lấy chính xác trường sub từ token
    return this.ordersService.findMyOrders(userId);
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
