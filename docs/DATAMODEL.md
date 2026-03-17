# Adatmodell


<small>
Név: Szántó Orsolya

Neptun kód: H93NV2
h-s azonosító: h378048
</small>

# 1.1 Dokumentáció

## 1.1.2 Adatmodell

---

## Entitások

### Felhasználó

| Mező | Leírás |
|-----|------|
| id | egyedi azonosító |
| név | felhasználó neve |
| email | felhasználó email címe |
| szerepkör | felhasználó szerepköre |
| telefonszám | felhasználó telefonszáma |
| cím | felhasználó címe |

---

### Termék

| Mező | Leírás |
|-----|------|
| id | egyedi azonosító |
| név | termék neve |
| leírás | termék részletes leírása |
| ár | termék ára |
| készlet | elérhető készlet mennyisége |
| képek | termékhez tartozó képek |
| kategória | a termék kategóriája |
| aktív-e | a termék elérhető-e a webshopban |
| létrehozás dátuma | a termék létrehozásának dátuma |
| módosítás dátuma | a termék utolsó módosításának dátuma |

---

### Kategória

| Mező | Leírás |
|-----|------|
| id | egyedi azonosító |
| név | kategória neve |
| leírás | kategória leírása |
| aktív-e | a kategória aktív állapota |

---

### Rendelés

| Mező | Leírás |
|-----|------|
| id | egyedi azonosító |
| felhasználó id | a rendelést leadó felhasználó azonosítója |
| rendelés dátuma | rendelés időpontja |
| rendelés státusza | rendelés aktuális állapota |
| végösszeg | a rendelés teljes összege |
| szállítási adatok | a rendelés szállítási címe |
| rendeléshez tartozó tételek | a rendelés tételei |
| megjegyzés | opcionális megjegyzés a rendeléshez |

---

### Rendelési tételek

| Mező | Leírás |
|-----|------|
| id | egyedi azonosító |
| rendelés id | a rendelés azonosítója |
| termék id | a rendelt termék azonosítója |
| darabszám | rendelt mennyiség |
| egységár a rendelés pillanatában | a termék ára a rendelés időpontjában |
| részösszeg | a tétel teljes ára |

---

## Kapcsolatok

- **Kategória 1 — N Termék**
- **Felhasználó 1 — N Rendelés**
- **Rendelés 1 — N RendelésiTétel**
- **Termék 1 — N RendelésiTétel**
