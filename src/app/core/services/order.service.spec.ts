import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrderService } from './order.service';
import {
  collection,
  query,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from 'firebase/firestore';

vi.mock('firebase/firestore');

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OrderService();
  });

  describe('createOrder', () => {
    it('should create a new order with items', async () => {
      const mockOrderRef = { id: 'order-123' };
      vi.mocked(addDoc).mockResolvedValue(mockOrderRef as any);

      const userId = 'user-1';
      const shippingData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',
        zipCode: '10001',
      };
      const cartItems = [
        {
          id: 'item-1',
          productId: 'prod-1',
          quantity: 2,
          name: 'Product 1',
          price: 100,
          image: 'test.jpg',
          unitPrice: 100,
          subtotal: 200,
          product: {
            id: 'prod-1',
            name: 'Product 1',
            price: 100,
            image: 'test.jpg',
          },
        },
      ];
      const total = 200;

      const orderId = await service.createOrder(
        userId,
        shippingData,
        cartItems,
        total
      );

      expect(orderId).toBe('order-123');
      expect(addDoc).toHaveBeenCalled();
    });

    it('should handle order creation error', async () => {
      const error = new Error('Firestore error');
      vi.mocked(addDoc).mockRejectedValue(error);

      const userId = 'user-1';
      const shippingData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',
        zipCode: '10001',
      };

      await expect(
        service.createOrder(userId, shippingData, [], 0)
      ).rejects.toThrow();
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-04-14');
      const formatted = service.formatDate(date);
      expect(formatted).toContain('2026');
      expect(formatted).toContain('április');
      expect(formatted).toContain('14');
    });

    it('should return dash for undefined date', () => {
      const formatted = service.formatDate(undefined);
      expect(formatted).toBe('-');
    });
  });

  describe('getStatusLabel', () => {
    it('should return Hungarian status label for pending', () => {
      const label = service.getStatusLabel('pending');
      expect(label).toBe('Feldolgozás alatt');
    });

    it('should return Hungarian status label for shipped', () => {
      const label = service.getStatusLabel('shipped');
      expect(label).toBe('Szállításban');
    });

    it('should return Hungarian status label for delivered', () => {
      const label = service.getStatusLabel('delivered');
      expect(label).toBe('Kiszállított');
    });
  });
});
