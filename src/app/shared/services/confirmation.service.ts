import { Injectable, signal, computed } from '@angular/core';

export interface ConfirmationDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean; // Red color for destructive actions
}

export interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationDialogOptions | null;
  isLoading: boolean;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private readonly state = signal<ConfirmationState>({
    isOpen: false,
    options: null,
    isLoading: false,
  });

  readonly isOpen = computed(() => this.state().isOpen);
  readonly options = computed(() => this.state().options);
  readonly isLoading = computed(() => this.state().isLoading);

  /**
   * Confirmáció dialógus megnyitása
   * @param options Dialog beállítások
   * @returns Promise<boolean> - true ha confirm, false ha cancel
   */
  async confirm(options: ConfirmationDialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.state.set({
        isOpen: true,
        options,
        isLoading: false,
        onConfirm: async () => {
          this.state.update((s) => ({ ...s, isLoading: true }));
          try {
            resolve(true);
            this.close();
          } catch (error) {
            console.error('Confirmáció hiba:', error);
            this.state.update((s) => ({ ...s, isLoading: false }));
          }
        },
        onCancel: () => {
          resolve(false);
          this.close();
        },
      });
    });
  }

  /**
   * Confirmáció dialógus bezárása
   */
  close(): void {
    this.state.set({
      isOpen: false,
      options: null,
      isLoading: false,
    });
  }

  /**
   * Confirm gomb kattintása
   */
  onConfirm(): void {
    const { onConfirm } = this.state();
    if (onConfirm) {
      onConfirm();
    }
  }

  /**
   * Cancel gomb kattintása
   */
  onCancel(): void {
    const { onCancel } = this.state();
    if (onCancel) {
      onCancel();
    }
  }
}
