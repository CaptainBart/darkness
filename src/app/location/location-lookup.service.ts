import { Injectable } from '@angular/core';
import { bindCallback, Observable, of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { GeocodingService, SearchResult } from './geocoding.service';
import { Location } from './location.model';
import tz_lookup from "tz-lookup";

@Injectable({providedIn: 'root'})
export class LocationLookupService {
  constructor(
    private readonly geocodingService: GeocodingService
  ) { }

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
          map(result => (
            { name: result.display_name,
              lat: coords.latitude,
              lng: coords.longitude,
              timezone: tz_lookup(coords.latitude, coords.longitude)
            }))
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

    return ({
        name: result.display_name,
        lat: +result.lat,
        lng: +result.lng,
        timezone: tz_lookup(+result.lat, +result.lng)
      });
  }
}
