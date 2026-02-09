import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    tap(loggedIn => {
      if (!loggedIn) {
        console.warn('🔒 User not authenticated. Redirecting to login.');
        // router.navigate(['/login']); // Auth0 SDK handles redirect usually, or we can force it
        auth.loginWithRedirect({
          appState: { target: state.url }
        });
      }
    })
  );
};