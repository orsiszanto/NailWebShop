# Receptgyűjtemény

**Webes alkalmazás specifikáció**
**Programrendszerek fejlesztése gyakorlat**
**Angular + Firebase – Demonstrációs projekt**
**2026. tavasz**

---

## 1. Bevezetés

A Műköröm Webshop egy Angular és Firebase alapú webes alkalmazás, amely lehetővé teszi műköröm alapanyagok böngészését, kosárba helyezését és megrendelését. A projekt célja egy modern, reszponzív webshop megvalósítása, amely bemutatja a frontend és backend integrációját valós környezetben.

A rendszer két fő szerepkört különböztet meg: adminisztrátor és vásárló. A vásárlók regisztráció után rendeléseket adhatnak le, míg az adminisztrátor a termékek és rendelések kezeléséért felel.

### 1.1. Technológiai stack

- **Angular** – Kliens oldali keretrendszer
- **Firebase** – Backend szolgáltatások
- **Firebase Authentication** – Felhasználókezelés
- **SCSS** – Stíluskezelés

---

## 2. Szerepkörök

### 2.1. Adminisztrátor

Az admin előre regisztrált fiókkal rendelkezik, teljes hozzáféréssel a rendszerhez (seed adat). Jogosultságai:

- Termékek létrehozása, módosítása és törlése
- Kategóriák kezelése
- Rendelések megtekintése
- Rendelések státuszának módosítása

### 2.2. Vásárló

A vásárló regisztráció után használhatja a rendszer teljes funkcionalitását. Jogosultságai:

- Termékek böngészése és szűrése
- Termékek kosárba helyezése
- Rendelések leadása
- Saját rendelések megtekintése
- Profiladatok kezelése

---

## 3. Funkcionális követelmények

1. A felhasználó regisztrálhat e-mail és jelszó megadásával.
2. A felhasználó bejelentkezhet a rendszerbe Firebase Authentication segítségével.
3. A felhasználó böngészheti a termékeket kategória szerint.
4. A felhasználó kereshet termékeket név alapján.
5. A felhasználó rendezheti a termékeket ár vagy név szerint.
6. A felhasználó termékeket helyezhet kosárba.
7. A kosár tartalma megjeleníthető és módosítható.
8. A felhasználó rendelést adhat le a kosár tartalma alapján.
9. A felhasználó megtekintheti saját rendeléseit.
10. Az admin termékeket hozhat létre, módosíthat és törölhet.
11. Az admin kategóriákat kezelhet.
12. Az admin megtekintheti az összes rendelést.
13. Az admin módosíthatja a rendelés státuszát.

---

## 4. Nem-funkcionális követelmények

1. Firebase Authentication alapú biztonságos bejelentkezés.
2. Role-based hozzáférés (admin vs felhasználó).
3. Reszponzív felhasználói felület (mobile-first megközelítés).
4. Lazy loading alkalmazása Angular routing esetén.
5. Hatékony adatlekérdezés Firebase Firestore használatával.
6. Hibakezelés felhasználóbarát üzenetekkel.
7. Egységes design rendszer és UI komponensek használata.
8. Gyors betöltési idő és optimalizált erőforrás-kezelés.

---

## 5. Kliens oldali nézetek

Az Angular alkalmazás az alábbi fő nézeteket (oldalakat) tartalmazza:

### 5.1. Nyilvános nézetek

- **Főoldal** – Termékek listázva
- **Terméklista oldal** – Szűrés és keresés lehetősége
- **Termék részletek** - Termékadatok megjelenítése
- **Bejelentkezés** – E-mail és jelszó megadása
- **Regisztráció** – Új fiók létrehozása

### 5.2. Bejelentkezett felhasználói nézetek

- **Kosár oldal** – Kosár tartalmának kezelése
- **Rendelés oldal** – Rendelés leadása
- **Profil oldal** – Felhasználói adatok kezelése
- **Saját rendelések** – Korábbi rendelések listája
- **Rendelés részletek** – Egy adott rendelés megjelenítése

### 5.3. Admin nézetek

- **Admin dashboard** – Áttekintő felület
- **Termékkezelés** – CRUD műveletek termékekhez
- **Kategóriakezelés** – Kategóriák kezelése
- **Rendeléskezelés** – Rendelések listázása és státusz módosítása

---

## 6. Telepítés és futtatás

A rendszer Firebase alapokon működik, ezért külön backend szerver telepítése nem szükséges.

- Node.js (v24)
- Angular CLI (v21)
- Firebase CLI (v15)

---

## 7. Mappaszerkezet

A GitHub repository várt struktúrája:

| Mappa / Fájl | Leírás |
|---|---|
| `/docs` | Dokumentáció (ez a specifikáció is) |
| `/src` | Angular alkalmazás forráskód |
| `/src/app` | Az alkalmazás fő logikai felépítése (core, layout, shared, features) |
| `/src/app/core` | Globális szolgáltatások (Firebase, auth, guardok, modellek) |
| `/src/app/layout` | Layout komponensek (header, navigation, footer, shell) |
| `/src/app/shared` | Újrahasznosítható UI komponensek és utility-k |
| `/src/app/features` | Funkciók szerinti modulok (shop, cart, order, user, admin) |
| `/src/styles` | Globális stílusok és design rendszer |
| `/.github/workflows` | Automatikus értékelés és CI folyamatok |
| `.gitignore` | Git által figyelmen kívül hagyott fájlok |
| `README.md` | Telepítési és futtatási útmutató |