import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // ms, default 5000
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Notifications signal
  private readonly notificationsSignal = signal<Notification[]>([]);
  readonly notifications = this.notificationsSignal.asReadonly();

  /**
   * Success notification
   */
  success(title: string, message: string, duration: number = 5000): void {
    this.show({ type: 'success', title, message, duration });
  }

  /**
   * Error notification
   */
  error(title: string, message: string, duration: number = 7000): void {
    this.show({ type: 'error', title, message, duration });
  }

  /**
   * Warning notification
   */
  warning(title: string, message: string, duration: number = 5000): void {
    this.show({ type: 'warning', title, message, duration });
  }

  /**
   * Info notification
   */
  info(title: string, message: string, duration: number = 5000): void {
    this.show({ type: 'info', title, message, duration });
  }

  /**
   * Show notification (legacy method for compatibility)
   */
  showSuccess(message: string): void {
    this.success('Siker', message);
  }

  /**
   * Show error (legacy method)
   */
  showError(message: string): void {
    this.error('Hiba', message);
  }

  /**
   * Show info (legacy method)
   */
  showInfo(message: string): void {
    this.info('Információ', message);
  }

  /**
   * Internal: show notification
   */
  private show(options: Omit<Notification, 'id'>): void {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      ...options,
    };

    this.notificationsSignal.update((notifs) => [...notifs, notification]);

    // Auto-remove after duration
    if (options.duration) {
      setTimeout(() => {
        this.remove(notification.id);
      }, options.duration);
    }
  }

  /**
   * Manually remove notification
   */
  remove(id: string): void {
    this.notificationsSignal.update((notifs) =>
      notifs.filter((n) => n.id !== id)
    );
  }
}