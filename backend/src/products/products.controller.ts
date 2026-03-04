import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto'; // DTO kiểm soát dữ liệu đầu vào
import { UpdateProductDto } from './dto/update-product.dto';

import { RolesGuard} from '../auth/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  // constructor dùng để thiết lập giá trị ban đầu và phổ biến nhất là
  // thực hiện Dependency Injection (tiêm phụ thuộc) để kết nối các service hoặc repository vào controller

  @Post()
  @SetMetadata('roles', ['admin']) // Chỉ cho phép admin mới có quyền tạo sản phẩm
  @UseGuards(RolesGuard) // Sử dụng guard để kiểm tra quyền truy cập
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query('search') search: string) {
    return this.productsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
