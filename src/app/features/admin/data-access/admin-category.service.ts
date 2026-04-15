import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Category } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class AdminCategoryService {
  private firestore = inject(Firestore);
  private categoriesCollection = collection(this.firestore, 'categories');

  async getAll(): Promise<Category[]> {
    try {
      const snapshot = await getDocs(this.categoriesCollection);
      return snapshot.docs.map((doc: QueryDocumentSnapshot<unknown>) => {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          ...data,
        } as Category;
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async create(category: Omit<Category, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.categoriesCollection, {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async update(id: string, category: Partial<Category>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'categories', id);
      await updateDoc(docRef, {
        ...category,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'categories', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}
