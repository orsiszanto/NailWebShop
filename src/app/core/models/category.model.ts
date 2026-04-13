/**
 * Kategória adatmodell
 * A Firestore 'categories' gyűjteményben tárolódik
 */
export interface Category {
  // Alapadatok
  id: string; // Firestore doc ID
  name: string; // Kategória neve
  description: string; // Kategória leírása

  // Státusz
  active: boolean; // Kategória aktív állapota

  // Audit mezők
  createdAt: Date; // Kategória létrehozásának dátuma
  updatedAt: Date; // Utolsó módosítás dátuma
}