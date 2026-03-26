import { OrderItem } from './order-item.model';

export interface Order {
  id: string;
  userId: string;
  orderDate: Date;
  status: OrderStatus;
  total: number;
  shippingData: ShippingData;
  items: OrderItem[];
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}