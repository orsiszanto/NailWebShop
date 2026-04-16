import { Injectable } from '@angular/core';
import { firebaseApp } from '../../../core/firebase/firebase.config';
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { Product } from '../../../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly firestore = getFirestore(firebaseApp);

  /**
   * Összes termék lekérése
   * @returns Promise<Product[]>
   */
  async getAll(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'products'));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
    } catch (error) {
      console.error('Hiba az összes termék lekérésénél:', error);
      throw new Error('Nem sikerült betölteni a termékeket.');
    }
  }

  /**
   * Egyetlen termék lekérése ID alapján
   * @param productId Termék ID
   * @returns Promise<Product>
   */
  async getById(productId: string): Promise<Product> {
    try {
      const docRef = doc(this.firestore, 'products', productId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        throw new Error('Termék nem található.');
      }

      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as Product;
    } catch (error) {
      console.error(`Hiba a termék (${productId}) lekérésénél:`, error);
      throw new Error('Nem sikerült betölteni a terméket.');
    }
  }

  /**
   * Kategória szerint termékek lekérése
   * @param categoryId Kategória ID
   * @returns Promise<Product[]>
   */
  async getByCategory(categoryId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(this.firestore, 'products'),
        where('categoryId', '==', categoryId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
    } catch (error) {
      console.error(`Hiba a kategória (${categoryId}) termékeinek lekérésénél:`, error);
      throw new Error('Nem sikerült betölteni a kategória termékeket.');
    }
  }

  /**
   * Akciós termékek lekérése
   * @returns Promise<Product[]>
   */
  async getOnSale(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'products'));
      return querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Product))
        .filter((product) => product.oldPrice != null && product.oldPrice > product.price);
    } catch (error) {
      console.error('Hiba az akciós termékek lekérésénél:', error);
      throw new Error('Nem sikerült betölteni az akciós termékeket.');
    }
  }

  /**
   * Keresés terméknév alapján
   * @param searchTerm Keresési kifejezés
   * @returns Promise<Product[]>
   */
  async search(searchTerm: string): Promise<Product[]> {
    try {
      const allProducts = await this.getAll();
      const term = searchTerm.toLowerCase();
      return allProducts.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Hiba a keresésben:', error);
      throw new Error('Nem sikerült a keresést végrehajtani.');
    }
  }
}
