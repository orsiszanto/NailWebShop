import { OrderItem } from './order-item.model';

/**
 * Rendelés adatmodell
 * A Firestore 'orders' gyűjteményben tárolódik
 */
export interface Order {
  // Alapadatok
  id: string; // Firestore doc ID
  userId: string; // Rendelést leadó felhasználó ID (FK -> User.id)
  status: OrderStatus; // Rendelés aktuális állapota
  total: number; // Rendelés teljes összege (Ft)

  // Szállítási adatok
  shippingData: ShippingData; // A rendelés szállítási címe

  // Rendelés tételei
  items: OrderItem[]; // A rendelés tételei (termék + mennyiség + ár)

  // Opcionális adatok
  notes?: string; // Opcionális megjegyzés a rendeléshez

  // Audit mezők
  orderDate: Date; // Rendelés időpontja
  createdAt?: Date; // Rendelés létrehozásának dátuma
  updatedAt?: Date; // Utolsó módosítás dátuma
}

/**
 * Rendelés státusza
 * - pending: Új, feldolgozás alatt
 * - confirmed: Megerősített
 * - shipped: Szállításban
 * - delivered: Kiszállított
 * - cancelled: Törölve/visszavonva
 */
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Szállítási adatok
 */
export interface ShippingData {
  name: string; // Szállítás címzettjének neve
  email: string; // Szállítás email
  phone: string; // Szállítás telefonszáma
  address: string; // Szállítás utcacíme
  city: string; // Szállítás városa
  zipCode: string; // Szállítás irányítószáma
}