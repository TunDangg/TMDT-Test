export interface Products {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock_quantity?: number;
  image_url?: string;
  category?: string;
  quantity: number;
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
