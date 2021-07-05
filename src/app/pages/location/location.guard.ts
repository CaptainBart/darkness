import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class LocationGuard implements CanActivate {
  public constructor(
    private readonly locationService: LocationService,
    private readonly router: Router
  )
  { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.locationService.hasLocation()) {
        return true;
      }

      return this.router.parseUrl('/location');
  }
  
}
