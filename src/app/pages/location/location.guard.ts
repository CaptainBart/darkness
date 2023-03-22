import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocationService } from './location.service';

export const locationGuard: CanActivateFn = () => {
  const locationService: LocationService = inject(LocationService);
  const router: Router = inject(Router);
  
  if(locationService.hasLocation()) {
    return true;
  }

  return router.parseUrl('/location');
};
