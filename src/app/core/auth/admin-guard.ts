import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from './auth-store';
import { skipWhile, take, map } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const adminGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Async guard: Observable<boolean>-ot adunk vissza
  // Megvárjuk, amíg az AuthStore inicializálása befejeződik (loading = false)
  return toObservable(authStore.loading).pipe(
    // Kihagy értékeket, amíg a loading true (még betöltésben van)
    skipWhile((loading) => loading === true),
    // Csak az első false-t vesszük (betöltés kész)
    take(1),
    // Most már ellenőrizhetjük a role-t az oknyomott user-ről
    map(() => {
      const user = authStore.user();

      if (user && user.role === 'admin') {
        return true;
      }

      // Nem admin vagy nincs bejelentkezve: redirect to home
      router.navigate(['/']);
      return false;
    })
  );
};
