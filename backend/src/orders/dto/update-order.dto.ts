import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  // Bổ sung thêm trường status để admin có thể cập nhật trạng thái đơn hàng
  // Các giá trị này phải khớp với enum đã định nghĩa trong Order entity
  status?: 'pending' | 'processing' | 'shipped' | 'cancelled';
}
