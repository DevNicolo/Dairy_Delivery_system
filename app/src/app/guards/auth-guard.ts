import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from '../services/auth'; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggedIn()) {
    return true;
  }
  else {
    router.navigate(['/login']);
    return false;
  }
};