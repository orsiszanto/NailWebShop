import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from './auth-store';

export const adminGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.user();
  const isLoading = authStore.loading();

  // Ha még betöltésben van, engedd át (az adatok megérkezése után majd ellenőriz)
  if (isLoading) {
    return true;
  }

  // Ha nincs felhasználó vagy nem admin
  if (!user || user.role !== 'admin') {
    router.navigate(['/']);
    return false;
  }

  // Admin: engedd át
  return true;
};
