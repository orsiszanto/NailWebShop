# AI Prompt Napló

## 1. Projekt architektúra és struktúra

**Prompt:**

* webshop felépítés tervezése Angular + Firebase stackkel
* mappastruktúra, core / shared / feature modulok
* routing struktúra kialakítása

**Eredmény:**

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

---

## 13. TypeScript Firestore spread type hibák

**Prompt:**

* TS2698 hiba: "Spread types may only be created from object types"
* admin-service-ekben doc.data() spread operátor problémája

**AI válasz:**

* `doc.data() as Record<string, unknown>` típusos castolás javaslat
* firestore QueryDocumentSnapshot<unknown> kezelése

**Döntés:**

* ✅ ELFOGADVA - a cast helyes és type-safe
* alkalmazva: admin-category.service, admin-order.service, admin-product.service
* getById() metódusban is külön kezelve

**Eredmény:**

* TS2698 hibák eltűntek
* type-safe Firestore integrációs

---

## 14. SASS deprecation: darken() → color.adjust()

**Prompt:**

* Dart Sass 3.0 deprecation figyelmeztetés
* darken() függvény lecserélése

**AI válasz (módosítva):**

* Javasolt: `color.adjust($color, $lightness: -10%)`
* Szükséges: `@use 'sass:color'` import

**Döntés:**

* ✅ ELFOGADVA - a color modul import szükséges volt
* ❌ JAVÍTVA - hiányzott a sass:color import, amit az AI nem jelölt rá
* 6 file: checkout-page, order-detail-page, confirmation-dialog

**Eredmény:**

* Dart Sass compatibilitás 3.0-hoz
* jövőbiztos SCSS kód

---

## 15. Route guard alkalmazás - checkout védelem

**Prompt:**

* `/checkout` route-ot nem védi authGuard
* automatikus értékelés kritikája: csak komponensben van logika, nem route-on

**AI válasz:**

* `canActivate: [authGuard]` a route-definícióban
* admin route-val párhuzamos védelemre

**Döntés:**

* ✅ ELFOGADVA (teljes) - checkout route-a authGuard-dal
* ✅ ELFOGADVA - admin route adminGuard-dal
* user/orders, user/profile már védett volt

**Eredmény:**

* Route guard az összes kritikus útvonalون
* evaluation pont: 1/2 → 2/2 védett útvonalakra

---

## 16. CartStore unit teszt suite

**Prompt:**

* Unit tesztek mennyiségi kritérium: min. 10 pont, jelenleg 9
* CartStore logika tesztelésére nincsenek tesztek

**AI válasz:**

* 9 érdemi teszt CartStore-hoz
* addItem, updateQuantity, removeItem, clearCart tesztek
* computed values (totalItems, totalPrice) validáció
* localStorage persistence tesztek

**Döntés:**

* ✅ ELFOGADVA (teljes) - CartStore.spec.ts
* 18+ teszt összességében (order.service 5 + checkout-flow 4 + cart.store 9)
* evaluation pont: 1/2 → 2/2 unit tesztek

**Eredmény:**

* CartStore logika 100%-ban tesztelt
* localStorage persistence bizonyított

---

## 17. Firebase Admin key biztonsági hiba

**Prompt:**

* nailshopweb-key.json commitolva van a repóban
* ezt kell eltávolítani + .gitignore-ba tenni

**AI válasz + Orsolya döntése:**

* `git rm --cached` az indexből eltávolítás
* `.gitignore` `scripts/*.json` és `scripts/nailshopweb-key.json` hozzáadás
* megjegyzés: hátrányos a git history-ből teljes eltávolítás → git filter-repo

**Döntés:**

* ✅ ELFOGADVA - gitignore és git rm
* ⚠️ TUDATOSAN ELFOGADOTT KOMPROMISSZUM - a régi commit még tartalmazza
* **KRITIKUS AKCIÓV: Firebase Console-ban regenerálni a private key-t**

**Eredmény:**

* evaluation pont: biztonsági terület → SecurityRules + választott key kezelés jó

---

## 🔍 Kritikus gondolkodás: AI korlátok és hibák

### Eset 1: SASS color module hiány

**Mit javasolt az AI?** 
- `color.adjust()` függvény a SCSS-ben
- DE: nem említette, hogy szükséges a `@use 'sass:color'` import

**Hogyan kezeltem?**
- Első fordítás után azonnal láttam a "no module with namespace color" hibát
- Saját kezdeményezésre hozzáadtam az importot
- **Tanulság:** Az AI-nak nem volt teljes Dart Sass tudása (2025-ös model cutoff)

### Eset 2: Git filter-repo vs git rm --cached

**Mit javasolt az AI?**
- Teljes eltávolítás `git filter-repo` vagy `git filter-branch` megoldásokkal
- DE: veszélyesnek jelölt (history rewrite)

**Hogyan kezeltem?**
- szándékosan választottam a konzervatív `git rm --cached` utat  
- tudatosan elfogadtam, hogy a régi commitok még tartalmazzák
- **Tanulság:** Az AI-nak igaza volt a veszélyekre, de hiányzott a pragmatikus kompromisszum javaslata

---

## 📊 Projekt fejlesztési ív

| Fázis | Promptok | Fő fejlesztés |
|-------|----------|--------------|
| 1. Tervezés | 1, 2 | Arch + design tokens |
| 2. Shop rendszer | 3, 4, 5 | Product list, filter, card |
| 3. Kosár & Checkout | 6, 7, 8 | CartStore, checkout flow |
| 4. Routing | 9, 10 | Navigáció, routing struktúra |
| 5. Optimalizálás | 11, 12 | Typizálás, a11y |
| **6. Biztonság & Testing** | **13-17** | **Auth guard, unit tests, security** |

A 3. mérföldkőhöz képest a prompt Log már teljes képet összerak az AI felhasználásáról a projekten végig.

