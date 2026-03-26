export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartProductSnapshot {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  imageAlt: string;
}

export interface CartItem extends OrderItem {
  product: CartProductSnapshot;
}