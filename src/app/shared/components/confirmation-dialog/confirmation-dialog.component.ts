import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (confirmationService.isOpen()) {
      <div class="confirmation-overlay" (click)="onCancel()">
        <div class="confirmation-dialog" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="confirmation-header">
            <h2 class="confirmation-title">{{ confirmationService.options()?.title }}</h2>
            <button
              type="button"
              class="confirmation-close"
              (click)="onCancel()"
              aria-label="Bezárás">
              ✕
            </button>
          </div>

          <!-- Message -->
          <div class="confirmation-content">
            <p class="confirmation-message">{{ confirmationService.options()?.message }}</p>
          </div>

          <!-- Actions -->
          <div class="confirmation-actions">
            <button
              type="button"
              class="confirmation-btn confirmation-btn--cancel"
              (click)="onCancel()"
              [disabled]="confirmationService.isLoading()">
              {{ confirmationService.options()?.cancelText || 'Mégse' }}
            </button>
            <button
              type="button"
              class="confirmation-btn confirmation-btn--confirm"
              [class.confirmation-btn--danger]="confirmationService.options()?.isDangerous"
              (click)="onConfirm()"
              [disabled]="confirmationService.isLoading()">
              @if (confirmationService.isLoading()) {
                <span class="spinner"></span>
              }
              {{ confirmationService.options()?.confirmText || 'Igen' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  readonly confirmationService = inject(ConfirmationService);

  onConfirm(): void {
    this.confirmationService.onConfirm();
  }

  onCancel(): void {
    this.confirmationService.onCancel();
  }
}


