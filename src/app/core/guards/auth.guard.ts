import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';


export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const validToken = authService.tokenExpired(token);

  if(token && !validToken) {
    return true;
  }

  router.navigate([`/login`]);
  return false;
};

