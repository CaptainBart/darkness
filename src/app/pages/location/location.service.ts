import { Injectable } from '@angular/core';
import { BehaviorSubject, bindCallback, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { Location } from './location.model';


const INITIAL_LOCATION: Location = {
  name: 'Roque de los Muchachos',
  lat: 28.764035,
  lng: -17.894234,
};

const LOCALSTORAGE_KEY = 'darkness.location';
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private static hasLocation(): boolean
  {
    return window.localStorage.getItem(LOCALSTORAGE_KEY) ? true : false;
  }

  private static fetchLocationFromStorage(): Location
  {
    return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY)) ?? INITIAL_LOCATION;
  }

  private static storeLocationToStorage(location: Location): void
  {
    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(location));
  }

  public locationSubject = new BehaviorSubject<Location>(LocationService.fetchLocationFromStorage());
  public location$: Observable<Location> = this.locationSubject.asObservable();

  constructor() { }

  public hasLocation(): boolean
  {
    return LocationService.hasLocation();
  }
  public changeLocation(location: Location)
  {
    LocationService.storeLocationToStorage(location);
    this.locationSubject.next(LocationService.fetchLocationFromStorage());
  }

  public fetchGpsLocation(): Observable<GeolocationPosition>
  {
    const getCurrentPosition = bindCallback(
      (cb: PositionCallback) => window.navigator.geolocation.getCurrentPosition(cb)
    );
    
    return getCurrentPosition().pipe(
      take(1)
    );
  }
}
