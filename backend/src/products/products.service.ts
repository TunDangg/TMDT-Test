import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Repository chứa các hàm có sẵn find, save, delete để thao tác với bảng database
import { Product } from './entities/product.entity'; // Đảm bảo đường dẫn này đúng
import { CreateProductDto } from './dto/create-product.dto'; // DTO kiểm soát dữ liệu đầu vào
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // Lấy dữ liệu từ MySQL với tính năng tìm kiếm
  async findAll(search?: string): Promise<Product[]> {
    if (search && search.trim()) {
      // Tìm kiếm trong cả tên và mô tả sản phẩm (case-insensitive)
      // Sử dụng LOWER() để tìm kiếm không phân biệt hoa thường
      return await this.productsRepository
        .createQueryBuilder('product')
        .where('LOWER(product.name) LIKE LOWER(:search)', { search: `%${search}%` })
        .orWhere('LOWER(product.description) LIKE LOWER(:search)', { search: `%${search}%` })
        .getMany();
    }
    // Nếu không có search query, trả về tất cả sản phẩm
    return await this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm có id là ${id}`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(newProduct);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
