import { Routes } from '@angular/router';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';

export const ORDER_ROUTES: Routes = [
  {
    path: 'checkout',
    component: CheckoutPageComponent,
  },
];