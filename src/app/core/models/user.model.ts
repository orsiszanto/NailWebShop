/**
 * Felhasználó adatmodell
 * A Firestore 'users' gyűjteményben tárolódik
 */
export interface User {
  // Alapadatok
  id: string; // Firestore doc ID (Firebase UID)
  email: string; // Felhasználó email címe (egyedi)
  name: string; // Felhasználó neve
  role: UserRole; // Felhasználó szerepköre

  // Opcionális adatok
  phone?: string; // Telefonszám
  address?: string; // Szállítási cím

  // Metaadatok
  createdAt: Date; // Fiók létrehozásának dátuma
  updatedAt: Date; // Utolsó módosítás dátuma
}

/**
 * Felhasználó roles
 * - customer: Vásárló (alapértelmezett)
 * - admin: Adminisztrátor
 */
export type UserRole = 'customer' | 'admin';