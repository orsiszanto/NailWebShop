import { Component, inject, input } from '@angular/core';
import { CartStore } from '../../../cart/data-access/cart.store';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [],
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.scss',
})
export class AddToCartComponent {
  private cartStore = inject(CartStore);
  private notificationService = inject(NotificationService);

  productId = input.required<string>();
  productName = input.required<string>();
  productPrice = input.required<number>();
  productOldPrice = input<number | null>(null);
  productImageAlt = input.required<string>();
  minQuantity = input<number>(1);
  maxQuantity = input<number>(99);

  quantity = 1;
  addedMessageVisible = false;

  decreaseQuantity(): void {
    if (this.quantity > this.minQuantity()) {
      this.quantity -= 1;
    }
  }

  increaseQuantity(): void {
    if (this.quantity < this.maxQuantity()) {
      this.quantity += 1;
    }
  }

  addToCart(): void {
    this.cartStore.addItem(
      this.productId(),
      {
        id: this.productId(),
        name: this.productName(),
        price: this.productPrice(),
        oldPrice: this.productOldPrice() ?? undefined,
        imageAlt: this.productImageAlt?.() || this.productName?.(),
      },
      this.quantity
    );

    this.notificationService.showSuccess(
      `${this.productName()} hozzáadva a kosárhoz!`
    );

    this.addedMessageVisible = true;

    setTimeout(() => {
      this.addedMessageVisible = false;
    }, 2000);
  }
}