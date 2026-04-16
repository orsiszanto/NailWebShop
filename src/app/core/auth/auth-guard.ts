import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth-store';
import { map, skipWhile, first } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Auth Guard - bejelentkezési igényelő útvonalakhoz
 * Ha a felhasználó nincs bejelentkezve, redirect a bejelentkezéshez
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const isAuthenticated = authStore.isAuthenticated();
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
        const currentAuthenticated = authStore.isAuthenticated();
        // Utolsó ellenőrzés
        if (!currentAuthenticated) {
          router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
        return true;
      })
    );
  }

  // Ha be van jelentkezve, engedd át
  if (isAuthenticated) {
    return true;
  }

  // Nem bejelentkezve -> redirect a bejelentkezéshez
  router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

