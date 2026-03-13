export interface Products {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock_quantity?: number;
  image_url?: string;
  category?: string;
  quantity: number;
  is_active?: boolean;
}

export interface CartItem {
  id: number
  name: string
  price: number
  description?: string
  stock_quantity?: number
  category?: string
  image_url?: string
  quantity: number
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Products; // Thêm thông tin sản phẩm vào OrderItem
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' |'cancelled';
  created_at: Date;
  items?: OrderItem[]; // Mối quan hệ một-nhiều với OrderItem
}
