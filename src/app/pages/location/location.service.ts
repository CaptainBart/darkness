import { Injectable } from '@angular/core';
import { BehaviorSubject, bindCallback, Observable, of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { GeocodingService, SearchResult } from './geocoding.service';
import { Location } from './location.model';

const LOCALSTORAGE_KEY = 'darkness.location';

const INITIAL_LOCATION: Location = {
  name: 'Roque de los Muchachos',
  lat: 28.764035,
  lng: -17.894234,
};

@Injectable({providedIn: 'root'})
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

  public hasLocationSubject = new BehaviorSubject<boolean>(LocationService.hasLocation());
  public hasLocation$: Observable<boolean> = this.hasLocationSubject.asObservable();

  constructor(private readonly geocodingService: GeocodingService) { }

  public hasLocation(): boolean
  {
    return LocationService.hasLocation();
  }
  public changeLocation(location: Location)
  {
    LocationService.storeLocationToStorage(location);
    this.locationSubject.next(LocationService.fetchLocationFromStorage());
    this.hasLocationSubject.next(LocationService.hasLocation());
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


  public fetchCurrentLocation(): Observable<Location>
  {
    return this.fetchGpsLocation().pipe(
      map(position => position.coords),
      mergeMap(
        coords => this.geocodingService.reverse(coords.latitude, coords.longitude).pipe(
          map(result => ({ name: result.display_name, lat: coords.latitude, lng: coords.longitude }))
        )
      )
    );
  }

  public fetchLocation(name: string): Observable<Location>
  {
    return this.geocodingService.search(name).pipe(
      map(results => this.findBestMatch(results))
    );
  }

  private findBestMatch(results: SearchResult[]): Location
  {
    let result = results.find(result => result.category === 'boundary');
    if(!result && results.length > 0) {
      result = results[0];
    }

    if(!result) {
      return null;
    }

    return ({name: result.display_name, lat: +result.lat, lng: +result.lng});
  }
}
