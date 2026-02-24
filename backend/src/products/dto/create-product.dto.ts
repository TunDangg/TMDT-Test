export class CreateProductDto {
  id: number;
  name: string;
  price: number;
  description: string; // Dấu ? nghĩa là không bắt buộc phải có
  stock_quantity: number;
  category: string;
  image_url: string;
}
