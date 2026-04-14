import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth-store';

/**
 * Auth Guard - bejelentkezési igényelő útvonalakhoz
 * Ha a felhasználó nincs bejelentkezve, redirect a bejelentkezéshez
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  // Nem bejelentkezve -> redirect a bejelentkezéshez
  router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

