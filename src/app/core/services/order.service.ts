import { Injectable } from '@angular/core';
import { firestore } from '../firebase/firebase.config';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  collectionGroup,
  addDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Order, OrderStatus, ShippingData } from '../models/order.model';
import { OrderItem, CartItem } from '../models/order-item.model';

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  /**
   * Felhasználó összes rendelésének lekérése
   * @param userId Felhasználó ID
   * @returns Promise<Order[]>
   */
  async getUserOrders(userId: string): Promise<OrderWithItems[]> {
    try {
      // Query: orders where userId == param
      const q = query(
        collection(firestore, 'orders'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const orders: OrderWithItems[] = [];

      // Minden rendeléshez hozzáadjuk az items-et
      for (const orderDoc of querySnapshot.docs) {
        const orderData = orderDoc.data() as Omit<Order, 'id'>;
        const order: Order = {
          id: orderDoc.id,
          ...orderData,
        };

        // Items lekérése a subcollection-ből
        const itemsSnapshot = await getDocs(
          collection(firestore, 'orders', orderDoc.id, 'items')
        );

        const items: OrderItem[] = itemsSnapshot.docs.map((itemDoc) =>
          itemDoc.data() as OrderItem
        );

        orders.push({
          ...order,
          items,
        });
      }

      return orders;
    } catch (error) {
      console.error('Hiba a rendelések lekérésénél:', error);
      throw new Error('Nem sikerült betölteni a rendeléseket.');
    }
  }

  /**
   * Egyetlen rendelés részletei (order + items)
   * @param orderId Rendelés ID
   * @returns Promise<OrderWithItems>
   */
  async getOrderDetails(orderId: string): Promise<OrderWithItems> {
    try {
      const orderDocRef = doc(firestore, 'orders', orderId);
      const orderSnapshot = await getDoc(orderDocRef);

      if (!orderSnapshot.exists()) {
        throw new Error('Rendelés nem található.');
      }

      const orderData = orderSnapshot.data() as Omit<Order, 'id'>;
      const order: Order = {
        id: orderSnapshot.id,
        ...orderData,
      };

      // Items lekérése
      const itemsSnapshot = await getDocs(
        collection(firestore, 'orders', orderId, 'items')
      );

      const items: OrderItem[] = itemsSnapshot.docs.map((itemDoc) =>
        itemDoc.data() as OrderItem
      );

      return {
        ...order,
        items,
      };
    } catch (error) {
      console.error('Hiba a rendelés részletei lekérésénél:', error);
      throw new Error('Nem sikerült betölteni a rendelés részleteit.');
    }
  }

  /**
   * Rendelések szűrése státusz alapján
   * @param userId Felhasználó ID
   * @param status Rendelés státusza
   * @returns Promise<OrderWithItems[]>
   */
  async getUserOrdersByStatus(
    userId: string,
    status: OrderStatus
  ): Promise<OrderWithItems[]> {
    try {
      const q = query(
        collection(firestore, 'orders'),
        where('userId', '==', userId),
        where('status', '==', status)
      );

      const querySnapshot = await getDocs(q);
      const orders: OrderWithItems[] = [];

      for (const orderDoc of querySnapshot.docs) {
        const orderData = orderDoc.data() as Omit<Order, 'id'>;
        const order: Order = {
          id: orderDoc.id,
          ...orderData,
        };

        const itemsSnapshot = await getDocs(
          collection(firestore, 'orders', orderDoc.id, 'items')
        );

        const items: OrderItem[] = itemsSnapshot.docs.map((itemDoc) =>
          itemDoc.data() as OrderItem
        );

        orders.push({
          ...order,
          items,
        });
      }

      return orders;
    } catch (error) {
      console.error('Hiba a szűrt rendelések lekérésénél:', error);
      throw new Error('Nem sikerült betölteni a szűrt rendeléseket.');
    }
  }

  /**
   * Új rendelés létrehozása
   * @param userId Felhasználó ID
   * @param shippingData Szállítási adatok
   * @param cartItems Kosár tételei
   * @param total Rendelés teljes összege
   * @returns Promise<string> - Rendelés ID
   */
  async createOrder(
    userId: string,
    shippingData: ShippingData,
    cartItems: CartItem[],
    total: number
  ): Promise<string> {
    try {
      // 1. Rendelés dokumentum létrehozása
      const orderData = {
        userId,
        status: 'pending' as OrderStatus,
        total,
        shippingData,
        notes: '',
        orderDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(firestore, 'orders'), orderData);
      const orderId = orderRef.id;

      // 2. Rendelés tételeinek hozzáadása (items subcollection)
      for (const cartItem of cartItems) {
        const itemData: OrderItem = {
          id: crypto.randomUUID(),
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          name: cartItem.name || cartItem.product?.name || '',
          price: cartItem.price || cartItem.product?.price || 0,
          image: cartItem.image || cartItem.product?.image,
          unitPrice: cartItem.unitPrice,
          subtotal: cartItem.subtotal,
        };

        await addDoc(
          collection(firestore, 'orders', orderId, 'items'),
          itemData
        );
      }

      console.log('[OrderService] Rendelés létrehozva:', orderId);
      return orderId;
    } catch (error) {
      console.error('[OrderService] Hiba a rendelés létrehozásánál:', error);
      throw new Error('Nem sikerült a rendelést feldolgozni. Kérjük, próbáld később.');
    }
  }

  /**
   * Formázott dátum
   * @param date Dátum objektum
   * @returns Formázott dátum string (pl: "2026. április 14.")
   */
  formatDate(date: Date | undefined): string {
    if (!date) return '-';

    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Státusz lefordítása magyarra
   * @param status Rendelés státusza
   * @returns Magyar nevű státusz
   */
  getStatusLabel(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      pending: 'Feldolgozás alatt',
      confirmed: 'Megerősített',
      shipped: 'Szállításban',
      delivered: 'Kiszállított',
      cancelled: 'Törölve',
    };

    return statusMap[status] || status;
  }
}
