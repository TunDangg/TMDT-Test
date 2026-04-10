import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './entities/voucher.entity';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
  ) {}

  async validateVoucher(code: string, cartTotal: number) {
    // 1. Tìm mã trong db
    const voucher = await this.voucherRepository.findOne({ where: { code } });

    if (!voucher) {
      throw new NotFoundException(`Mã giảm giá ${code} không tồn tại hoặc nhập sai`);
    }

    // 2. Kiểm tra trạng thái kích hoạt
    if (!voucher.is_active) {
      throw new BadRequestException(`Mã giảm giá ${code} hiện không khả dụng`);
    }

    // 3. Kiểm tra hạn sử dụng
    if (new Date() > new Date(voucher.expiry_date)) {
      throw new BadRequestException(`Mã giảm giá ${code} đã hết hạn`);
    }

    // 4. Kiểm tra số lượt sử dụng (ĐÃ SỬA LỖI)
    if (Number(voucher.used_count) >= Number(voucher.usage_limit)) {
      throw new BadRequestException(`Mã giảm giá ${code} đã đạt giới hạn sử dụng`);
    }

    // 5. Kiểm tra giá trị đơn hàng tối thiểu (Ép kiểu an toàn)
    if (Number(cartTotal) < Number(voucher.min_order_value)) {
      throw new BadRequestException(
        `Đơn hàng của bạn phải đạt tối thiểu ${Number(voucher.min_order_value).toLocaleString('vi-VN')}đ để sử dụng mã ${code}`,
      );
    }

    // 6. Tính toán số tiền được giảm
    let discountAmount = 0;
    if (voucher.discount_type === 'fixed') {
      discountAmount = Number(voucher.discount_value);
    } else if (voucher.discount_type === 'percent') {
      discountAmount = (cartTotal * Number(voucher.discount_value)) / 100;
      // Nếu có đặt giới hạn số tiền giảm tối đa
      if (voucher.max_discount_amount && discountAmount > Number(voucher.max_discount_amount)) {
        discountAmount = Number(voucher.max_discount_amount);
      }
    }

    return {
      valid: true,
      voucher_code: voucher.code,
      discount_amount: discountAmount,
      final_total: cartTotal - discountAmount > 0 ? cartTotal - discountAmount : 0,
    };
  }

  // Hàm dùng để gọi khi đơn hàng tạo thành công ( Tăng số lượt đã dùng lên 1 )
  async incrementUsedcount(code: string) {
    await this.voucherRepository.increment({ code }, 'used_count', 1);
  }

  async findAll() {
    return await this.voucherRepository.find({
      order: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const voucher = await this.voucherRepository.findOne({ where: { id } });
    if (!voucher) throw new NotFoundException(`Không tìm thấy mã giảm giá với id ${id}`);
    return voucher;
  }

  async create(createVoucherDto: CreateVoucherDto) {
    // Ép kiểu code thành viết hoa trước lưu
    createVoucherDto.code = createVoucherDto.code.toUpperCase();
    const newVoucher = this.voucherRepository.create(createVoucherDto);
    return await this.voucherRepository.save(newVoucher);
  }

  async update(id: number, updateVoucherDto: UpdateVoucherDto) {
    if (updateVoucherDto.code) {
      updateVoucherDto.code = updateVoucherDto.code.toUpperCase();
    }
    // Kiểm tra các trường là số, nếu là chuỗi rỗng thì chuyển về null hoặc 0
    const dto = updateVoucherDto as Record<string, any>;
    const numericFields = [
      'discount_value',
      'min_order_value',
      'max_discount_amount',
      'usage_limit',
    ];

    numericFields.forEach((field) => {
      if (dto[field] === '') {
        dto[field] = field === 'max_discount_amount' ? null : 0;
      }
    });

    numericFields.forEach((field) => {
      if (updateVoucherDto[field] === '') {
        // max_discount_amount thường có thể để null (không giới hạn),
        // các trường khác có thể để 0 tùy logic của bạn.
        updateVoucherDto[field] = field === 'max_discount_amount' ? null : 0;
      }
    });
    await this.voucherRepository.update(id, updateVoucherDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const voucher = await this.findOne(id);
    return await this.voucherRepository.remove(voucher);
  }
}
