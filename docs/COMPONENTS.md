# Komponens-terv

<small>
Név: Szántó Orsolya

Neptun kód: H93NV2
h-s azonosító: h378048
</small>

# 1.1 Dokumentáció

# 1.1.3 Komponens-terv

## Komponensfa

Az alkalmazás komponens-alapú architektúrát használ.  
Az alábbi fa a fő komponensek hierarchikus felépítését mutatja.

AppComponent
│
├── Layout
│   ├── HeaderComponent
│   ├── NavigationComponent
│   └── FooterComponent
│
├── HomePageComponent
│
├── Shop
│   ├── ProductListComponent
│   │   ├── ProductFilterComponent
│   │   ├── ProductSearchComponent
│   │   └── ProductCardComponent
│   │
│   └── ProductDetailComponent
│       ├── ProductGalleryComponent
│       └── AddToCartComponent
│
├── Cart
│   ├── CartPageComponent
│   └── CartItemComponent
│
├── Order
│   ├── CheckoutPageComponent
│   └── OrderSummaryComponent
│
├── User
│   ├── LoginComponent
│   ├── RegisterComponent
│   ├── ProfileComponent
│   ├── OrdersListComponent
│   └── OrderDetailComponent
│
├── Admin
│   ├── AdminDashboardComponent
│   ├── ProductManagementComponent
│   ├── CategoryManagementComponent
│   └── OrderManagementComponent
│
├── NotFoundComponent
├── UnauthorizedComponent
│
└── Shared
    ├── ButtonComponent
    ├── InputComponent
    ├── ModalComponent
    └── LoadingSpinnerComponent

---

# Modulok / oldalak

Az alábbi táblázat bemutatja az alkalmazás fő oldalait és az azokhoz tartozó komponenseket.

| Oldal | Használt komponensek |
|-----|-----|
| Főoldal | HomePageComponent, ProductCardComponent |
| Terméklista | ProductListComponent, ProductFilterComponent, ProductSearchComponent, ProductCardComponent |
| Termék részletek | ProductDetailComponent, ProductGalleryComponent, AddToCartComponent |
| Kosár | CartPageComponent, CartItemComponent |
| Rendelés | CheckoutPageComponent, OrderSummaryComponent |
| Bejelentkezés | LoginComponent |
| Regisztráció | RegisterComponent |
| Profil | ProfileComponent |
| Saját rendelések | OrdersListComponent |
| Rendelés részletek | OrderDetailComponent |
| Admin dashboard | AdminDashboardComponent |
| Termékkezelés | ProductManagementComponent |
| Kategóriakezelés | CategoryManagementComponent |
| Rendelések kezelése | OrderManagementComponent |
| 404 oldal | NotFoundComponent |
| Jogosultsági hiba | UnauthorizedComponent |

<small>Megjegyzés: A HeaderComponent, NavigationComponent, FooterComponent és a Shared komponensek több oldalon újrahasznosított, globális elemek, ezért nem külön oldalakhoz, hanem az alkalmazás általános felépítéséhez tartoznak.</small>
