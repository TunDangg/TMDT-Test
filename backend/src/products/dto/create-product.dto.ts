export class CreateProductDto {
  name: string;
  price: number;
  description?: string;     // Dấu ? nghĩa là không bắt buộc phải có
  stock_quantity?: number;
  category?: string;
  image_url?: string;       // khai báo trước để sau này có tìm ảnh món ăn
}
