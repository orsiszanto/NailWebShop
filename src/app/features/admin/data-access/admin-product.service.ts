import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  QueryDocumentSnapshot,
  getFirestore,
} from 'firebase/firestore';
import { firebaseApp } from '../../../core/firebase/firebase.config';
import { Product } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class AdminProductService {
  private readonly firestore = getFirestore(firebaseApp);
  private readonly productsCollection = collection(this.firestore, 'products');

  async getAll(): Promise<Product[]> {
    try {
      const snapshot = await getDocs(this.productsCollection);
      return snapshot.docs.map((doc: QueryDocumentSnapshot<unknown>) => {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          ...data,
        } as Product;
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(this.firestore, 'products', id);
      const snapshot = await getDocs(
        query(this.productsCollection, where('id', '==', id))
      );
      const data = snapshot.docs[0]?.data() as Record<string, unknown> | undefined;
      if (!data) return null;
      return {
        id: snapshot.docs[0].id,
        ...data,
      } as Product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async create(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.productsCollection, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: string, product: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'products', id);
      await updateDoc(docRef, {
        ...product,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'products', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async getByCategoryId(categoryId: string): Promise<Product[]> {
    try {
      const q = query(
        this.productsCollection,
        where('categoryId', '==', categoryId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: QueryDocumentSnapshot<unknown>) => {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          ...data,
        } as Product;
      });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }
}
