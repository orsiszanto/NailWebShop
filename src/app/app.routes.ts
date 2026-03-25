import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'shop',
        loadChildren: () =>
          import('./features/shop/shop.routes').then((m) => m.SHOP_ROUTES),
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