import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOrderService, OrderStatus } from '../../data-access/admin-order.service';
import { Order } from '../../../../core/models';
import { signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderManagementComponent implements OnInit {
  private adminOrderService = inject(AdminOrderService);
  private notificationService = inject(NotificationService);

  orders = signal<Order[]>([]);
  loading = signal(false);
  isDetailModalOpen = signal(false);
  selectedOrder = signal<Order | null>(null);
  newStatus = signal<OrderStatus>('pending');

  statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'Függőben' },
    { value: 'confirmed', label: 'Megerősített' },
    { value: 'shipped', label: 'Szállítás alatt' },
    { value: 'delivered', label: 'Szállított' },
    { value: 'cancelled', label: 'Törölve' },
  ];

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
    this.loading.set(true);
    try {
      const data = await this.adminOrderService.getAll(100);
      this.orders.set(data);
    } catch (error) {
      this.notificationService.error('Hiba', 'Rendelések betöltése sikertelen');
    } finally {
      this.loading.set(false);
    }
  }

  openDetailModal(order: Order) {
    this.selectedOrder.set(order);
    this.newStatus.set(order.status as OrderStatus);
    this.isDetailModalOpen.set(true);
  }

  closeDetailModal() {
    this.isDetailModalOpen.set(false);
    this.selectedOrder.set(null);
  }

  async updateOrderStatus() {
    const order = this.selectedOrder();
    if (!order) return;

    this.loading.set(true);
    try {
      await this.adminOrderService.updateStatus(order.id, this.newStatus());
      this.notificationService.success('Siker', `Rendelés státusza frissítve: ${this.getStatusLabel(this.newStatus())}`);
      this.closeDetailModal();
      await this.loadOrders();
    } catch (error) {
      this.notificationService.error('Hiba', 'Rendelés státuszának frissítése sikertelen');
    } finally {
      this.loading.set(false);
    }
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find((s) => s.value === status)?.label || status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  formatDate(date: any): string {
    if (!date) return '-';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getTotalAmount(order: Order): number {
    return order.total;
  }

  getShippingCity(order: Order): string {
    return order.shippingData?.city || '-';
  }

  getShippingAddress(order: Order): string {
    const data = order.shippingData;
    if (!data) return '-';
    return `${data.address}, ${data.zipCode} ${data.city}`;
  }

  getShippingEmail(order: Order): string {
    return order.shippingData?.email || '-';
  }
}


