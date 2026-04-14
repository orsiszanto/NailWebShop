import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { signal, computed } from '@angular/core';
import { CartStore } from '../../../cart/data-access/cart.store';
import { AuthStore } from '../../../../core/auth/auth-store';
import { OrderService } from '../../../../core/services/order.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ShippingData } from '../../../../core/models/order.model';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageTitleComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent implements OnInit {
  private readonly cartStore = inject(CartStore);
  private readonly authStore = inject(AuthStore);
  private readonly orderService = inject(OrderService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // Readonly cart data
  readonly items = this.cartStore.items;
  readonly totalItems = this.cartStore.totalItems;
  readonly totalPrice = this.cartStore.totalPrice;
  readonly user = this.authStore.user;

  // Component state
  private readonly state = signal({
    loading: false,
    error: null as string | null,
  });

  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  // Checkout form
  readonly checkoutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{4,5}$/)]],
    terms: [false, [Validators.requiredTrue]],
  });

  ngOnInit(): void {
    // Pre-fill form with user data if available
    const currentUser = this.user();
    if (currentUser) {
      this.checkoutForm.patchValue({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
        address: currentUser.address || '',
      });
    }
  }

  /**
   * Rendelés leadása
   */
  async submitOrder(): Promise<void> {
    if (this.checkoutForm.invalid || this.items().length === 0) {
      this.notificationService.showError('Kérjük, töltsd ki az összes mezőt!');
      return;
    }

    const userId = this.user()?.id;
    if (!userId) {
      this.notificationService.showError('Kérjük, jelentkezz be a rendeléshez!');
      return;
    }

    this.state.set({ loading: true, error: null });

    try {
      const shippingData: ShippingData = {
        name: this.checkoutForm.value.name,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phone,
        address: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        zipCode: this.checkoutForm.value.zipCode,
      };

      // Create order in Firestore
      const orderId = await this.orderService.createOrder(
        userId,
        shippingData,
        this.items(),
        this.totalPrice()
      );

      // Clear cart after successful order
      this.cartStore.clearCart();

      this.notificationService.showSuccess('Rendelés sikeresen leadva!');

      // Redirect to success/order details page
      setTimeout(() => {
        this.router.navigate(['/user/orders', orderId]);
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ismeretlen hiba történt.';
      this.notificationService.showError(message);
      this.state.set({ loading: false, error: message });
    }
  }
}