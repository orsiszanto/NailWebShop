import { Routes } from '@angular/router';

export const INFO_ROUTES: Routes = [
  {
    path: 'impresszum',
    loadComponent: () =>
      import('./pages/impressum-page/impressum-page.component').then(
        (m) => m.ImpressumComponent
      ),
  },
  {
    path: 'gyik',
    loadComponent: () =>
      import('./pages/faq-page/faq-page.component').then(
        (m) => m.FaqComponent
      ),
  },
  {
    path: 'elerhetosegek',
    loadComponent: () =>
      import('./pages/contact-page/contact-page.component').then(
        (m) => m.ContactComponent
      ),
  },
];