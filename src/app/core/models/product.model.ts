/**
 * Termék adatmodell
 * A Firestore 'products' gyűjteményben tárolódik
 */
export interface Product {
  // Alapadatok
  id: string; // Firestore doc ID
  name: string; // Termék neve
  description: string; // Termék részletes leírása
  price: number; // Termék aktuális ára (Ft)
  stock: number; // Elérhető készlet mennyisége

  // Metaadatok
  category: string; // Kategória ID referencija (FK -> Category.id)
  active: boolean; // Termék aktív/elérhető-e a webshopban

  // Opcionális adatok
  oldPrice?: number; // Régi ár (akcióhoz)
  images: string[]; // Termékhez tartozó képek URL-jei

  // Audit mezők
  createdAt: Date; // Termék létrehozásának dátuma
  updatedAt: Date; // Utolsó módosítás dátuma
}