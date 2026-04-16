import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container" role="region" aria-live="polite" aria-label="Értesítések">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div
          class="notification"
          [class]="'notification--' + notification.type">
          <div class="notification__content">
            <strong class="notification__title">{{ notification.title }}</strong>
            <p class="notification__message">{{ notification.message }}</p>
          </div>
          <button
            type="button"
            class="notification__close"
            aria-label="Értesítés bezárása"
            (click)="closeNotification(notification.id)">
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './notification-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationContainerComponent {
  notificationService = inject(NotificationService);

  closeNotification(id: string): void {
    this.notificationService.remove(id);
  }
}
