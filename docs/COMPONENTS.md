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
│   ├── ShellComponent
│   │   ├── HeaderComponent
│   │   ├── TopBarComponent
│   │   └── FooterComponent
│
├── Home
│   ├── HomePageComponent
│   └── Components (home specifikus komponensek)
│
├── Shop
│   ├── ShopRoutes
│   ├── Pages
│   │   ├── ProductListComponent
│   │   └── ProductDetailComponent
│   ├── Components
│   │   ├── AddToCartComponent
│   │   ├── ProductCardComponent
│   │   ├── ProductFilterComponent
│   │   ├── ProductGalleryComponent
│   │   └── ProductSearchComponent
│   └── DataAccess
│       ├── CategoryService
│       ├── ProductService
│       └── ShopStore
│
├── Cart
│   ├── CartRoutes
│   ├── Pages
│   │   └── CartPageComponent
│   ├── Components
│   │   └── CartItemComponent
│   └── DataAccess
│       └── CartStore
│
├── Order
│   ├── OrderRoutes
│   ├── Pages (checkout, order history, etc.)
│   ├── Components
│   └── DataAccess
│
├── User
│   ├── UserRoutes
│   ├── Pages (login, register, profile, etc.)
│   ├── Components
│   └── DataAccess
│
├── Admin
│   ├── AdminRoutes
│   ├── Pages (dashboard, product management, etc.)
│   ├── Components
│   └── DataAccess
│
├── Info
│   ├── InfoRoutes
│   └── Pages (contact, about, etc.)
│
├── Errors
│   ├── NotFoundComponent
│   └── UnauthorizedComponent
│
└── Shared
    ├── Components
    │   ├── ButtonComponent
    │   ├── EmptyStateComponent
    │   ├── IconButtonComponent
    │   ├── InputComponent
    │   ├── LoadingSpinnerComponent
    │   ├── ModalComponent
    │   ├── PageTitleComponent
    │   ├── SearchInputComponent
    │   └── SectionHeaderComponent
    ├── Pipes
    └── Utils

---

# Modulok / oldalak

Az alábbi táblázat bemutatja az alkalmazás fő oldalait és az azokhoz tartozó komponenseket.

| Oldal | Használt komponensek |
|-----|-----|
| Főoldal | HomePageComponent, PageTitleComponent |
| Shop főoldal (terméklista) | ProductListComponent, ProductCardComponent, ProductFilterComponent, ProductSearchComponent, EmptyStateComponent, LoadingSpinnerComponent |
| Termék részletek | ProductDetailComponent, AddToCartComponent, ProductGalleryComponent |
| Kosár | CartPageComponent, CartItemComponent, PageTitleComponent |
| Rendelés (checkout, history) | Order specifikus komponensek |
| Felhasználó (login, register, profile) | User specifikus komponensek |
| Admin (dashboard, management) | Admin specifikus komponensek |
| Info oldalak (contact, about) | Info specifikus komponensek |
| 404 oldal | NotFoundComponent |
| Jogosultsági hiba | UnauthorizedComponent |

<small>Megjegyzés: A Layout komponensek (ShellComponent, HeaderComponent, TopBarComponent, FooterComponent) és a Shared komponensek több oldalon újrahasznosított, globális elemek, ezért nem külön oldalakhoz, hanem az alkalmazás általános felépítéséhez tartoznak. Az egyes feature modulok saját routes, pages, components és data-access rétegekkel rendelkeznek.</small>
