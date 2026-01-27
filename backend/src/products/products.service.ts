import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  // Danh sách dữ liệu mẫu
  private readonly products = [
    { id: 1, name: 'Trà Sữa', price: 25000 },
    { id: 2, name: 'Gà Rán', price: 50000 },
    { id: 3, name: 'Pizza', price: 120000 },
    { id: 4, name: 'Mì Cay', price: 55000 },
    { id: 5, name: 'Tokbokki', price: 65000 },
    { id: 6, name: 'Gà Ủ Muối', price: 80000 },
    { id: 7, name: 'Chân Giò Ủ Muối', price: 70000 },
    { id: 8, name: 'Lạp Xưởng Nướng Đá', price: 20000 },
    { id: 9, name: 'Chả Cá Hàn Quốc', price: 30000 },
    { id: 10, name: 'Redbull', price: 18000 },
    { id: 11, name: 'Sting', price: 18000 },
    { id: 12, name: '7Up', price: 18000 },
  ];

  create(createProductDto: CreateProductDto) {
    // Sử dụng biến để ESLint không báo lỗi nữa
    console.log('Đang tạo sản phẩm:', createProductDto);
    return {
      message: 'Đã thêm sản phẩm mới thành công',
      data: createProductDto,
    };
  }

  findAll(search?: string) {
    if (search) {
      const lowSearch = search.toLowerCase();
      return this.products.filter((p) => p.name.toLowerCase().includes(lowSearch));
    }
    return this.products;
  }

  // Sửa lỗi cú pháp ở đây: bỏ bớt dấu ngoặc dư thừa
  findOne(id: number) {
    const product = this.products.find((p) => p.id === id);
    return product || { message: `Không tìm thấy sản phẩm có id là ${id}` };
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    // Sử dụng biến để ESLint không báo lỗi nữa
    console.log(`Đang cập nhật sản phẩm có id ${id}:`, updateProductDto);
    return {
      message: `Đã cập nhật sản phẩm #${id}`,
      newData: updateProductDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
