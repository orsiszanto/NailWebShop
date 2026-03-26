export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  images: string[];
  category: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}