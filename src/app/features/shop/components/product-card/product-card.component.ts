import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../../cart/data-access/cart.store';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private cartStore = inject(CartStore);
  private notificationService = inject(NotificationService);

  productId = input.required<string>();
  name = input.required<string>();
  price = input.required<number>();
  oldPrice = input<number | null>(null);
  imageAlt = input.required<string>();

  formatPrice(value: number | null): string {
    if (value === null) {
      return '';
    }

    return `${value.toLocaleString('hu-HU')} Ft`;
  }

  addToCart(): void {
    this.cartStore.addItem(this.productId(), {
      id: this.productId(),
      name: this.name(),
      price: this.price(),
      oldPrice: this.oldPrice() ?? undefined,
      imageAlt: this.imageAlt(),
    });

    this.notificationService.showSuccess(`${this.name()} hozzáadva a kosárhoz!`);
  }
}