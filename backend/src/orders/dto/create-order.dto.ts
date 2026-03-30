// Dinh nghia cau truc cho tung san pham trong don hang, bao gom id san pham, so luong va gia tai thoi diem mua
export class OrderItemDto {
  productId: number; // Frontend gửi productId
  quantity: number;
  price: number;
}

// Dinh nghia du lieu de gui len khi tao don hang, bao gom thong tin khach hang va danh sach san pham trong don hang
export class CreateOrderDto {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  voucher_code: string;
  note?: string;
  total_price: number;

  // Danh sach cac mon hang ( mang doi tuong OrderItemDto) de gui len khi tao don hang
  items: OrderItemDto[];
}
