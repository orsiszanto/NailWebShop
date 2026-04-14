import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../../../core/models/order-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly CART_STORAGE_KEY = 'nailshop_cart';

  // STATE
  private _items = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();

  readonly itemCount = computed(() => this._items().length);

  readonly totalItems = computed(() => {
    const value = this._items().reduce((sum, item) => sum + item.quantity, 0);
    console.log('[CartStore] totalItems:', value);
    return value;
  });

  readonly totalPrice = computed(() => {
    const value = this._items().reduce((sum, item) => sum + item.subtotal, 0);
    console.log('[CartStore] totalPrice:', value);
    return value;
  });

  // ACTIONS

  addItem(
    productId: string,
    product: CartItem['product'],
    quantity: number = 1
  ): void {
    console.log('[CartStore] addItem', { productId, quantity });

    const currentItems = this._items();
    const existingIndex = currentItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingIndex >= 0) {
      const existing = currentItems[existingIndex];
      const newQuantity = existing.quantity + quantity;

      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...existing,
        quantity: newQuantity,
        subtotal: newQuantity * existing.unitPrice,
      };

      this._items.set(updatedItems);
    } else {
      const newItem: CartItem = {
        id: crypto.randomUUID(),
        productId,
        quantity,
        name: product.name,
        price: product.price,
        unitPrice: product.price,
        subtotal: product.price * quantity,
        product,
      };

      this._items.set([...currentItems, newItem]);
    }

    this.saveToStorage();
    this.debugState();
  }

  updateQuantity(itemId: string, quantity: number): void {
    console.log('[CartStore] updateQuantity', { itemId, quantity });

    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const currentItems = this._items();

    const updatedItems = currentItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity,
            subtotal: quantity * item.unitPrice,
          }
        : item
    );

    this._items.set(updatedItems);
    this.saveToStorage();
    this.debugState();
  }

  removeItem(itemId: string): void {
    console.log('[CartStore] removeItem', itemId);

    const filtered = this._items().filter((item) => item.id !== itemId);
    this._items.set(filtered);

    this.saveToStorage();
    this.debugState();
  }

  clearCart(): void {
    console.log('[CartStore] clearCart');

    this._items.set([]);
    this.saveToStorage();
  }

  // STORAGE

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          quantity: Number(item.quantity) || 1,
          name: item.name || '',
          price: Number(item.price) || 0,
          image: item.image,
          unitPrice: Number(item.unitPrice) || 0,
          subtotal: Number(item.subtotal) || (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
          product: item.product || {
            id: item.productId,
            name: item.name || '',
            price: Number(item.price) || 0,
            image: item.image,
          },
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(
        this.CART_STORAGE_KEY,
        JSON.stringify(this._items())
      );
    } catch {
      console.warn('[CartStore] Failed to save to storage');
    }
  }

  // DEBUG

  private debugState(): void {
    console.log('[CartStore] state snapshot:', this._items());
  }
}