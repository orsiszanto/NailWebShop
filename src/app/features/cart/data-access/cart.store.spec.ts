import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CartStore } from './cart.store';
import { CartItem } from '../../../core/models/order-item.model';

describe('CartStore', () => {
  let store: CartStore;

  beforeEach(() => {
    localStorage.clear();
    store = new CartStore();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      const product = {
        id: 'prod-1',
        name: 'Red Nail Polish',
        price: 2500,
        image: 'red-polish.jpg',
      };

      store.addItem('prod-1', product, 1);

      expect(store.items().length).toBe(1);
      expect(store.items()[0].name).toBe('Red Nail Polish');
      expect(store.items()[0].quantity).toBe(1);
      expect(store.items()[0].subtotal).toBe(2500);
    });

    it('should increase quantity if item already exists', () => {
      const product = {
        id: 'prod-1',
        name: 'Red Nail Polish',
        price: 2500,
        image: 'red-polish.jpg',
      };

      store.addItem('prod-1', product, 1);
      store.addItem('prod-1', product, 2);

      expect(store.items().length).toBe(1);
      expect(store.items()[0].quantity).toBe(3);
      expect(store.items()[0].subtotal).toBe(7500); // 3 * 2500
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const product = {
        id: 'prod-1',
        name: 'Red Nail Polish',
        price: 2500,
        image: 'red-polish.jpg',
      };

      store.addItem('prod-1', product, 1);
      const itemId = store.items()[0].id;

      store.updateQuantity(itemId, 5);

      expect(store.items()[0].quantity).toBe(5);
      expect(store.items()[0].subtotal).toBe(12500); // 5 * 2500
    });

    it('should remove item if quantity is 0 or less', () => {
      const product = {
        id: 'prod-1',
        name: 'Red Nail Polish',
        price: 2500,
        image: 'red-polish.jpg',
      };

      store.addItem('prod-1', product, 1);
      const itemId = store.items()[0].id;

      store.updateQuantity(itemId, 0);

      expect(store.items().length).toBe(0);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const product1 = {
        id: 'prod-1',
        name: 'Red Nail Polish',
        price: 2500,
        image: 'red-polish.jpg',
      };
      const product2 = {
        id: 'prod-2',
        name: 'Blue Nail Polish',
        price: 2500,
        image: 'blue-polish.jpg',
      };

      store.addItem('prod-1', product1, 1);
      store.addItem('prod-2', product2, 1);

      const firstItemId = store.items()[0].id;
      store.removeItem(firstItemId);

      expect(store.items().length).toBe(1);
      expect(store.items()[0].name).toBe('Blue Nail Polish');
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const product = {
        id: 'prod-1',
        name: 'Red Nail Polish',
        price: 2500,
        image: 'red-polish.jpg',
      };

      store.addItem('prod-1', product, 1);
      store.addItem('prod-1', product, 1);

      store.clearCart();

      expect(store.items().length).toBe(0);
      expect(store.totalItems()).toBe(0);
      expect(store.totalPrice()).toBe(0);
    });
  });

  describe('computed values', () => {
    it('should calculate total items correctly', () => {
      const product1 = {
        id: 'prod-1',
        name: 'Red Nail Polish',
        price: 2500,
        image: 'red-polish.jpg',
      };
      const product2 = {
        id: 'prod-2',
        name: 'Blue Nail Polish',
        price: 3000,
        image: 'blue-polish.jpg',
      };

      store.addItem('prod-1', product1, 2);
      store.addItem('prod-2', product2, 3);

      expect(store.totalItems()).toBe(5); // 2 + 3
    });

    it('should calculate total price correctly', () => {
      const product1 = {
        id: 'prod-1',
        name: 'Red Nail Polish',
        price: 2500,
        image: 'red-polish.jpg',
      };
      const product2 = {
        id: 'prod-2',
        name: 'Blue Nail Polish',
        price: 3000,
        image: 'blue-polish.jpg',
      };

      store.addItem('prod-1', product1, 2);
      store.addItem('prod-2', product2, 1);

      expect(store.totalPrice()).toBe(7000); // (2 * 2500) + (1 * 3000)
    });
  });

  describe('localStorage persistence', () => {
    it('should save cart to localStorage', () => {
      const product = {
        id: 'prod-1',
        name: 'Red Nail Polish',
        price: 2500,
        image: 'red-polish.jpg',
      };

      store.addItem('prod-1', product, 1);

      const stored = localStorage.getItem('nailshop_cart');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!).length).toBe(1);
    });

    it('should load cart from localStorage on init', () => {
      const cartData = [
        {
          id: 'item-1',
          productId: 'prod-1',
          quantity: 2,
          name: 'Red Nail Polish',
          price: 2500,
          unitPrice: 2500,
          subtotal: 5000,
          product: {
            id: 'prod-1',
            name: 'Red Nail Polish',
            price: 2500,
            image: 'red-polish.jpg',
          },
        },
      ];

      localStorage.setItem('nailshop_cart', JSON.stringify(cartData));

      const newStore = new CartStore();
      expect(newStore.items().length).toBe(1);
      expect(newStore.items()[0].quantity).toBe(2);
      expect(newStore.totalPrice()).toBe(5000);
    });
  });
});
