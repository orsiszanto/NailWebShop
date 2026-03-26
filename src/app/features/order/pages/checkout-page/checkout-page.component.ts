import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../../cart/data-access/cart.store';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [RouterLink, PageTitleComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  private cartStore = inject(CartStore);

  readonly items = this.cartStore.items;
  readonly totalItems = this.cartStore.totalItems;
  readonly totalPrice = this.cartStore.totalPrice;
}