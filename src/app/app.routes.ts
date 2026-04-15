import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { authGuard } from './core/auth/auth-guard';
import { adminGuard } from './core/auth/admin-guard';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/home-page.component').then(
            (m) => m.HomePageComponent
          ),
      },
      {
        path: 'shop',
        loadChildren: () =>
          import('./features/shop/shop.routes').then((m) => m.SHOP_ROUTES),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/order/pages/checkout-page/checkout-page.component').then(
            (m) => m.CheckoutPageComponent
          ),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./features/user/user.routes').then((m) => m.USER_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/info/info.routes').then((m) => m.INFO_ROUTES),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/errors/not-found/not-found.component').then(
            (m) => m.NotFoundComponent
          ),
      },
    ],
  },
];