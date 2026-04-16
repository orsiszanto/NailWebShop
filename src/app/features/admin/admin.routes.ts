import { Routes } from '@angular/router';
import { adminGuard } from '../../core/auth/admin-guard';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/product-management/product-management.component').then(
            (m) => m.ProductManagementComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/category-management/category-management.component').then(
            (m) => m.CategoryManagementComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/order-management/order-management.component').then(
            (m) => m.OrderManagementComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
