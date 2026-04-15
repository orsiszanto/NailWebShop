import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Order } from '../../../core/models';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
  private firestore = inject(Firestore);
  private ordersCollection = collection(this.firestore, 'orders');

  async getAll(limitCount = 100): Promise<Order[]> {
    try {
      const q = query(
        this.ordersCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: QueryDocumentSnapshot<unknown>) => {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          ...data,
        } as Order;
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'orders', orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(this.firestore, 'orders', orderId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      const data = snapshot.data() as Record<string, unknown>;
      return {
        id: snapshot.id,
        ...data,
      } as Order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}
