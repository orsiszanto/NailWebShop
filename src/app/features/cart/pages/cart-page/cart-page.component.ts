import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../data-access/cart.store';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, CartItemComponent, PageTitleComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  private cartStore = inject(CartStore);

  readonly items = this.cartStore.items;
  readonly totalPrice = this.cartStore.totalPrice;
  readonly totalItems = this.cartStore.totalItems;

  clearCart(): void {
    this.cartStore.clearCart();
  }
}