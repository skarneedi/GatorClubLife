import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  // Inject Router
  const router = inject(Router);

  // Check if running in a browser environment
  if (typeof window === 'undefined') {
    // If no window object, deny access or decide accordingly.
    console.warn('No browser environment detected. Redirecting to login.');
    router.navigate(['/login']);
    return false;
  }

  // Check if the user is logged in using localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    return true; // Allow access if logged in.
  } else {
    // Redirect to login page if not logged in
    console.warn('User not authenticated. Redirecting to login.');
    router.navigate(['/login'], { queryParams: { returnUrl: router.url } }); // Pass the current URL as a query parameter
    return false;
  }
};