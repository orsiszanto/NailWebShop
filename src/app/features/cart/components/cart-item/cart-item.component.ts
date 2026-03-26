import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../data-access/cart.store';
import { CartItem } from '../../../../core/models/order-item.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  private cartStore = inject(CartStore);

  item = input.required<CartItem>();

  increase(): void {
    this.cartStore.updateQuantity(this.item().id, this.item().quantity + 1);
  }

  decrease(): void {
    if (this.item().quantity > 1) {
      this.cartStore.updateQuantity(this.item().id, this.item().quantity - 1);
    }
  }

  onManualInput(value: string): void {
    const quantity = Number(value);

    if (!isNaN(quantity) && quantity > 0) {
      this.cartStore.updateQuantity(this.item().id, quantity);
    }
  }

  remove(): void {
    this.cartStore.removeItem(this.item().id);
  }
}