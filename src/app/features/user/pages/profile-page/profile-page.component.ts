import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { signal, computed } from '@angular/core';
import { AuthStore } from '../../../../core/auth/auth-store';
import { AuthService } from '../../../../core/auth/auth.service';
import { OrderService, OrderWithItems } from '../../../../core/services/order.service';
import { User } from '../../../../core/models/user.model';
import { updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../../core/firebase/firebase.config';
import { NotificationService } from '../../../../core/services/notification.service';

export interface ProfileState {
  mode: 'view' | 'edit';
  activeTab: 'profile' | 'orders';
  loading: boolean;
  error: string | null;
  orders: OrderWithItems[];
  selectedOrderId: string | null;
}

@Component({
  selector: 'app-profile-page.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);

  // Auth state
  readonly user = this.authStore.user;
  readonly authLoading = this.authStore.loading;

  // Component state
  private readonly profileState = signal<ProfileState>({
    mode: 'view',
    activeTab: 'profile',
    loading: false,
    error: null,
    orders: [],
    selectedOrderId: null,
  });

  // Public computed selectors
  readonly mode = computed(() => this.profileState().mode);
  readonly activeTab = computed(() => this.profileState().activeTab);
  readonly loading = computed(() => this.profileState().loading);
  readonly error = computed(() => this.profileState().error);
  readonly orders = computed(() => this.profileState().orders);
  readonly selectedOrderId = computed(() => this.profileState().selectedOrderId);
  readonly selectedOrder = computed(() => {
    const orderId = this.selectedOrderId();
    if (!orderId) return null;
    return this.orders().find((o) => o.id === orderId);
  });

  // Edit form
  readonly editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
  });

  // Password change form
  readonly passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit(): void {
    // Load user data into form
    const userData = this.user();
    if (userData) {
      this.editForm.patchValue({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || '',
      });
    }

    // Load orders
    this.loadOrders();
  }

  /**
   * Rendelések betöltése
   */
  private loadOrders(): void {
    const userId = this.user()?.id;
    if (!userId) return;

    this.profileState.update((state) => ({ ...state, loading: true, error: null }));

    this.orderService
      .getUserOrders(userId)
      .then((orders) => {
        this.profileState.update((state) => ({
          ...state,
          orders: orders.sort(
            (a, b) =>
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          ),
          loading: false,
        }));
      })
      .catch((error) => {
        console.error('Hiba a rendelések betöltésénél:', error);
        this.profileState.update((state) => ({
          ...state,
          loading: false,
          error: 'Nem sikerült betölteni a rendeléseket.',
        }));
      });
  }

  /**
   * Edit módba lépés
   */
  enterEditMode(): void {
    this.profileState.update((state) => ({ ...state, mode: 'edit' }));
  }

  /**
   * Edit mód bezárása
   */
  cancelEdit(): void {
    this.profileState.update((state) => ({ ...state, mode: 'view', error: null }));
    // Form reset az eredeti adatokra
    const userData = this.user();
    if (userData) {
      this.editForm.patchValue({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || '',
      });
    }
  }

  /**
   * Profil adatok mentése
   */
  async saveProfile(): Promise<void> {
    if (this.editForm.invalid) return;

    this.profileState.update((state) => ({ ...state, loading: true, error: null }));

    try {
      const { name, email, phone, address } = this.editForm.value;
      const currentUser = this.user();

      if (!currentUser) {
        throw new Error('Nincs bejelentkezett felhasználó.');
      }

      const userId = currentUser.id;
      let emailChanged = false;

      // Email változott?
      if (email !== currentUser.email) {
        await this.authService.updateUserEmail(email);
        emailChanged = true;
      }

      // Firestore dokumentum frissítése (név, telefonszám, cím, email)
      await updateDoc(doc(firestore, 'users', userId), {
        name,
        email,
        phone: phone || null,
        address: address || null,
        updatedAt: new Date(),
      });

      // AuthStore user jelzés frissítése az új adatokkal
      const updatedUser: User = {
        ...currentUser,
        name,
        email,
        phone: phone || undefined,
        address: address || undefined,
      };
      this.authStore.updateUser(updatedUser);

      let successMessage = 'Profil adatok sikeresen mentve!';
      if (emailChanged) {
        successMessage +=
          ' Verifikációs email a régi és az új email címre küldve.';
      }

      this.notificationService.showSuccess(successMessage);

      this.profileState.update((state) => ({
        ...state,
        mode: 'view',
        loading: false,
        error: null,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ismeretlen hiba történt.';
      this.notificationService.showError(message);
      this.profileState.update((state) => ({
        ...state,
        loading: false,
        error: message,
      }));
    }
  }

  /**
   * Jelszó megváltoztatása
   */
  async changePassword(): Promise<void> {
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmPassword } = this.passwordForm.value;

    // Jelszavak egyezése
    if (newPassword !== confirmPassword) {
      this.profileState.update((state) => ({
        ...state,
        error: 'A jelszavak nem egyeznek!',
      }));
      return;
    }

    this.profileState.update((state) => ({ ...state, loading: true, error: null }));

    try {
      await this.authService.updateUserPassword(newPassword);

      // Form reset
      this.passwordForm.reset();

      this.profileState.update((state) => ({
        ...state,
        loading: false,
        error: 'Jelszó sikeresen megváltoztatva!',
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ismeretlen hiba történt.';
      this.profileState.update((state) => ({
        ...state,
        loading: false,
        error: message,
      }));
    }
  }

  /**
   * Tab váltása
   */
  switchTab(tab: 'profile' | 'orders'): void {
    this.profileState.update((state) => ({ ...state, activeTab: tab }));
  }

  /**
   * Rendelés részletei megjelenítése
   */
  selectOrder(orderId: string): void {
    const current = this.selectedOrderId();
    this.profileState.update((state) => ({
      ...state,
      selectedOrderId: current === orderId ? null : orderId,
    }));
  }

  /**
   * Form field error getter
   */
  getEditFieldError(fieldName: string): string | null {
    const control = this.editForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} mező kötelező.`;
    }
    if (control?.hasError('email')) {
      return 'Érvénytelen email cím.';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `${fieldName} legalább ${minLength} karakter hosszú kell hogy legyen.`;
    }
    return null;
  }

  /**
   * Password field error getter
   */
  getPasswordFieldError(fieldName: string): string | null {
    const control = this.passwordForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} mező kötelező.`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} legalább 6 karakter hosszú kell hogy legyen.`;
    }
    return null;
  }

  /**
   * Státusz label
   */
  getOrderStatusLabel(status: string): string {
    return this.orderService.getStatusLabel(status as any);
  }

  /**
   * Dátum formázása
   */
  formatDate(date: Date | undefined): string {
    return this.orderService.formatDate(date);
  }
}
