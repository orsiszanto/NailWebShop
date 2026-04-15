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
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/product-management/product-management.component').then(
            (m) => m.ProductManagementComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/category-management/category-management.component').then(
            (m) => m.CategoryManagementComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/order-management/order-management.component').then(
            (m) => m.OrderManagementComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
