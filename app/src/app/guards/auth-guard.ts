import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Recuperiamo il token (per ora dal localStorage, poi vedremo Preferences)
  const token = localStorage.getItem('my_token');

  if (token) { // if token exists, allow access
    return true;
  } else { // if no token, deny access and redirect to login
    console.warn('Accesso negato: devi essere autenticato per accedere a questa pagina.');
    router.navigate(['/login']);
    return false;
  }
};