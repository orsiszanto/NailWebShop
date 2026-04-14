/**
 * Rendelési tétel
 * A rendelés tételként tárolódik az Order.items tömbben
 */
export interface OrderItem {
  // Alapadatok
  id: string; // Tétel ID (lehet generált UUID)
  productId: string; // Termék ID referencija (FK -> Product.id)
  quantity: number; // Rendelt mennyiség (darab)

  // Termék pillanatkép
  name: string; // Termék neve a rendelés pillanatában
  price: number; // Termék ára a rendelés pillanatában
  image?: string; // Termék képe (URL)

  // Ár információ
  unitPrice: number; // Egységár a rendelés pillanatában (Ft)
  subtotal: number; // Tétel teljes ára = quantity * unitPrice (Ft)
}

/**
 * Termék pillanatkép a kosár/rendelésben
 * A termék aktuális adatait tároljuk a megrendeléskor
 */
export interface CartProductSnapshot {
  id: string; // Termék ID
  name: string; // Termék neve
  price: number; // Termék ára (aktuális)
  oldPrice?: number; // Régi ár (ha van akció)
  image?: string; // Termék képe (URL)
  imageAlt?: string; // Termék kép alt szövege
}

/**
 * Kosár tétel
 * Kiterjeszti az OrderItem-et a termék pillanatkép információival
 * A localStorage-ban vagy session állapotban tárolódik
 */
export interface CartItem extends OrderItem {
  product: CartProductSnapshot; // A termék aktuális adatai
}