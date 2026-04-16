import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from './auth-store';
import { map, skipWhile, first } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const adminGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.user();
  const isLoading = authStore.loading();

  // Ha még betöltésben van, várj az auth állapot lezárulására
  if (isLoading) {
    // Observable-t hozunk létre az authStore loading signal-ből
    // skipWhile: várd, amíg a loading true marad
    // first: vedd az első false-t
    return toObservable(authStore.loading).pipe(
      skipWhile((loading) => loading === true),
      first(),
      map(() => {
        const currentUser = authStore.user();
        // Utolsó ellenőrzés
        if (!currentUser || currentUser.role !== 'admin') {
          router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }

  // Ha nincs felhasználó vagy nem admin
  if (!user || user.role !== 'admin') {
    router.navigate(['/']);
    return false;
  }

  // Admin: engedd át
  return true;
};
