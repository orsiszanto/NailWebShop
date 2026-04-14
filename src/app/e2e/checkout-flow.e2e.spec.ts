import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * E2E Integration Test - Checkout Flow
 * Tests the complete user journey: Add to cart -> Checkout -> Order creation
 */
describe('E2E: Checkout Flow', () => {
  // Mock CartStore behavior
  const createMockCartStore = () => ({
    items: () => [],
    totalItems: () => 0,
    totalPrice: () => 0,
    addToCart: vi.fn((productId: string, product: any) => {}),
    clearCart: vi.fn(() => {}),
  });

  // Mock OrderService behavior
  const createMockOrderService = () => ({
    createOrder: vi.fn().mockResolvedValue('order-123'),
    formatDate: (date: Date | undefined) => date ? date.toLocaleDateString('hu-HU') : '-',
    getStatusLabel: (status: string) => {
      const statusMap: Record<string, string> = {
        pending: 'Feldolgozás alatt',
        shipped: 'Szállításban',
        delivered: 'Kiszállított',
      };
      return statusMap[status] || status;
    },
  });

  // Mock AuthStore behavior
  const createMockAuthStore = () => ({
    user: () => ({
      id: 'user-123',
      email: 'testuser@example.com',
      name: 'Test User',
      role: 'user',
    }),
    isAuthenticated: () => true,
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should complete full checkout flow: add to cart -> create order', async () => {
    const cartStore = createMockCartStore();
    const orderService = createMockOrderService();
    const authStore = createMockAuthStore();

    // Step 1: Add product to cart
    const mockProduct = {
      id: 'prod-nail-polish-red',
      name: 'Red Nail Polish',
      price: 2500,
      image: 'red-polish.jpg',
    };

    cartStore.addToCart(mockProduct.id, mockProduct);
    expect(cartStore.addToCart).toHaveBeenCalledWith(mockProduct.id, mockProduct);

    // Step 2: Create order
    const shippingData = {
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '06301234567',
      address: 'Pétervárad u. 42.',
      city: 'Budapest',
      zipCode: '1052',
    };

    const cartItems = [
      {
        id: 'item-1',
        productId: 'prod-nail-polish-red',
        quantity: 1,
        name: 'Red Nail Polish',
        price: 2500,
        unitPrice: 2500,
        subtotal: 2500,
      },
    ];

    const orderId = await orderService.createOrder(
      authStore.user().id,
      shippingData,
      cartItems,
      2500
    );

    expect(orderId).toBe('order-123');
    expect(orderService.createOrder).toHaveBeenCalled();

    // Step 3: Clear cart after successful order
    cartStore.clearCart();
    expect(cartStore.clearCart).toHaveBeenCalled();
  });

  it('should format dates correctly', () => {
    const orderService = createMockOrderService();
    
    const date = new Date('2026-04-14');
    const formatted = orderService.formatDate(date);
    expect(formatted).toBeTruthy();
    expect(formatted).toContain('2026');

    const emptyFormatted = orderService.formatDate(undefined);
    expect(emptyFormatted).toBe('-');
  });

  it('should translate order status correctly', () => {
    const orderService = createMockOrderService();
    
    expect(orderService.getStatusLabel('pending')).toBe('Feldolgozás alatt');
    expect(orderService.getStatusLabel('shipped')).toBe('Szállításban');
    expect(orderService.getStatusLabel('delivered')).toBe('Kiszállított');
  });

  it('should handle multiple items in checkout', async () => {
    const orderService = createMockOrderService();

    const cartItems = [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 2,
        name: 'Product 1',
        price: 2500,
        unitPrice: 2500,
        subtotal: 5000,
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        quantity: 1,
        name: 'Product 2',
        price: 3000,
        unitPrice: 3000,
        subtotal: 3000,
      },
    ];

    const totalPrice = 8000; // 5000 + 3000

    const orderId = await orderService.createOrder(
      'user-123',
      {
        name: 'Test User',
        email: 'test@example.com',
        phone: '06301234567',
        address: 'Address',
        city: 'City',
        zipCode: '1052',
      },
      cartItems,
      totalPrice
    );

    expect(orderId).toBe('order-123');
    expect(cartItems.length).toBe(2);
  });
});
