# AI Prompt Napló

## 1. Projekt architektúra és struktúra

**Prompt (lényeg):**

* webshop felépítés tervezése Angular + Firebase stackkel
* mappastruktúra, core / shared / feature modulok
* routing struktúra kialakítása

**AI válasz hatása:**

* kialakult a jelenlegi feature-alapú struktúra
* külön modulok: shop, cart, order, layout
* lazy loading routing bevezetése

---

## 2. Design rendszer és UI konzisztencia

**Prompt:**

* design token rendszer kialakítása (colors, spacing, typography)
* reusable komponensek (button, card, search, stb.)

**Eredmény:**

* SCSS token fájlok létrejöttek
* egységes spacing és színek
* webshop UI konzisztens lett

---

## 3. Product list és filter rendszer

**Prompt:**

* terméklista oldal logika
* keresés + filter kombinálása
* kategória, márka, ár, rendezés

**Eredmény:**

* `ProductListComponent` state + filtering logika
* `ProductFilterComponent` külön komponens
* event-alapú kommunikáció (`filterChange`, `resetFilters`)

---

## 4. Filter UX redesign

**Prompt:**

* filter panel UX javítása
* mobil vs desktop viselkedés
* collapsible filter

**Eredmény:**

* mobilon összehajtható filter
* desktopon mindig nyitott
* jobb webshop jelleg

---

## 5. Product card és quick add-to-cart

**Prompt:**

* product card webshopos kinézet
* kosárba rakás közvetlenül kártyáról

**Eredmény:**

* `ProductCardComponent` átalakítva
* number típusú price
* store-ba közvetlen írás
* notification integráció

---

## 6. Add-to-cart architektúra

**Prompt:**

* külön add-to-cart komponens vs direkt store hívás
* state kezelés

**Döntés:**

* AddToCartComponent → detail oldalon
* quick add → product cardból

**Eredmény:**

* egységes `CartStore` használat
* quantity kezelés komponensben

---

## 7. Cart rendszer (state + UI)

**Prompt:**

* kosár state kezelése Angular signalokkal
* localStorage persistencia

**Eredmény:**

* `CartStore`:

  * signal
  * computed (totalItems, totalPrice)
  * add/update/remove/clear

---

## 8. Cart item UI és logika

**Prompt:**

* cart item teljes UI (quantity, subtotal, remove)
* webshop szintű layout

**Eredmény:**

* `CartItemComponent`:

  * quantity stepper
  * manual input
  * subtotal számítás
  * remove action

---

## 9. Routing problémák és debug

**Prompt:**

* Angular routing hibák (duplicate path: '')
* checkout route nem működik

**Eredmény:**

* routing struktúra javítása
* külön feature route-ok
* checkout bekötése

---

## 10. Checkout oldal alap

**Prompt:**

* checkout page skeleton
* cart summary integráció

**Eredmény:**

* `CheckoutPageComponent`
* cart store integráció
* üres állapot kezelése

---

## 11. Type refactor (string → number)

**Prompt:**

* price típus egységesítése

**Eredmény:**

* minden price number lett
* formázás UI-ban történik
* típushibák javítva

---

## 12. Accessibility és UX finomítás

**Prompt:**

* aria attribútumok
* keyboard navigation
* focus states

**Eredmény:**

* aria-label, aria-live stb.
* focus-visible styling
* jobb usability

---

## 🔍 Megjegyzés

Az AI-t nem kódgenerálásra, hanem:

* architektúra tervezésre
* hibakeresésre
* refaktorálás támogatására
* UX döntések validálására

használtam.
