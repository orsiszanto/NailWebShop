import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders-list-page/orders-list-page.component').then(
        (m) => m.OrdersListPageComponent
      ),
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./pages/order-detail-page/order-detail-page.component').then(
        (m) => m.OrderDetailPageComponent
      ),
  },
];