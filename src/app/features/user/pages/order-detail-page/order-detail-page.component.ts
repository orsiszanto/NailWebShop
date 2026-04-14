import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { AuthStore } from '../../../../core/auth/auth-store';
import { OrderWithItems } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './order-detail-page.component.html',
  styleUrl: './order-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  order = signal<OrderWithItems | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrder();
  }

  private loadOrder(): void {
    const orderId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!orderId) {
      this.error.set('Rendelés ID szükséges');
      this.loading.set(false);
      return;
    }

    const userId = this.authStore.user()?.id;
    if (!userId) {
      this.router.navigate(['/user/login']);
      return;
    }

    this.orderService
      .getOrderDetails(orderId)
      .then((order) => {
        if (!order) {
          this.error.set('A rendelés nem található');
        } else {
          this.order.set(order);
        }
      })
      .catch((err) => {
        console.error('Failed to load order:', err);
        this.error.set('Hiba a rendelés betöltésekor');
      })
      .finally(() => this.loading.set(false));
  }

  getStatusLabel(status: any): string {
    return this.orderService.getStatusLabel(status as any);
  }

  formatDate(date: any): string {
    return this.orderService.formatDate(date);
  }
}
