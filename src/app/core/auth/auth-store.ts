import { Injectable, inject, effect } from '@angular/core';
import { signal, computed } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals
  private readonly authState = signal<AuthState>({
    user: null,
    loading: false,
    error: null,
  });

  // Public computed selectors
  readonly user = computed(() => this.authState().user);
  readonly loading = computed(() => this.authState().loading);
  readonly error = computed(() => this.authState().error);
  readonly isAuthenticated = computed(() => this.authState().user !== null);

  constructor() {
    // Inicializáljuk az auth state-et az aktuális felhasználóval
    this.initializeAuthState();
  }

  /**
   * Initialize auth state from Firebase
   */
  private initializeAuthState(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.authState.update((state) => ({
        ...state,
        user,
        loading: false,
      }));
    });
  }

  /**
   * Regisztráció
   */
  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<void> {
    this.authState.update((state) => ({ ...state, loading: true, error: null }));

    try {
      await this.authService.register(email, password, displayName);
      
      // Sikeres regisztráció után:
      // - A felhasználó kijelentkeztetett (az AuthService.register-ben)
      // - Redirect a bejelentkezéshez
      this.authState.update((state) => ({
        ...state,
        user: null,
        loading: false,
        error: null,
      }));
      this.router.navigate(['/user/login']);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ismeretlen hiba történt.';
      this.authState.update((state) => ({
        ...state,
        loading: false,
        error: message,
      }));
      throw error;
    }
  }

  /**
   * Bejelentkezés
   */
  async login(email: string, password: string): Promise<void> {
    this.authState.update((state) => ({ ...state, loading: true, error: null }));

    try {
      await this.authService.login(email, password);
      // Az onAuthStateChanged automatikusan triggerel az initializeAuthState()-ben
      // így a Firestore user adatok letöltődnek
      this.authState.update((state) => ({
        ...state,
        loading: false,
        error: null,
      }));
      // Sikeres bejelentkezés után redirect a főoldalra
      this.router.navigate(['/']);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ismeretlen hiba történt.';
      this.authState.update((state) => ({
        ...state,
        loading: false,
        error: message,
      }));
      throw error;
    }
  }

  /**
   * Kijelentkezés
   */
  async logout(): Promise<void> {
    this.authState.update((state) => ({ ...state, loading: true, error: null }));

    try {
      await this.authService.logout();
      this.authState.update((state) => ({
        ...state,
        user: null,
        loading: false,
        error: null,
      }));
      // Redirect a főoldalra
      this.router.navigate(['/']);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ismeretlen hiba történt.';
      this.authState.update((state) => ({
        ...state,
        loading: false,
        error: message,
      }));
      throw error;
    }
  }

  /**
   * Hibaüzenet törlése (manual)
   */
  clearError(): void {
    this.authState.update((state) => ({ ...state, error: null }));
  }

  /**
   * Felhasználó adatok frissítése a state-ben (pl. profil módosítás után)
   * @param user Frissített User objektum
   */
  updateUser(user: User | null): void {
    this.authState.update((state) => ({
      ...state,
      user,
      error: null,
    }));
  }

  /**
   * Fiók törlése: Firebase Auth + Firestore
   * @param password Felhasználó jelszava az ujrahitelesítéshez
   */
  async deleteAccount(password: string): Promise<void> {
    this.authState.update((state) => ({ ...state, loading: true, error: null }));

    try {
      await this.authService.deleteAccount(password);
      
      // Sikeres törlés után:
      // - Felhasználó kijelentkeztetett
      // - State törlve
      this.authState.update((state) => ({
        ...state,
        user: null,
        loading: false,
        error: null,
      }));
      
      // Redirect a főoldalra
      this.router.navigate(['/']);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ismeretlen hiba történt.';
      this.authState.update((state) => ({
        ...state,
        loading: false,
        error: message,
      }));
      throw error;
    }
  }
}

