import { inject, Injectable } from '@angular/core';
import { GeocodingService, SearchResult } from './geocoding.service';
import { Location } from './location.model';
//import tz_lookup from "tz-lookup";
import tz_lookup from '@photostructure/tz-lookup';

@Injectable({ providedIn: 'root' })
export class LocationLookupService {
  readonly #geocodingService = inject(GeocodingService);

  fetchGpsLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async fetchCurrentLocation(): Promise<Location> {
    const position = await this.fetchGpsLocation();
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    const result = await this.#geocodingService.reverse(location.lat, location.lng);
    return ({
      ...location,
      name: result.display_name,
      timezone: tz_lookup(location.lat, location.lng)
    });

  }

  async fetchLocation(name: string): Promise<Location | undefined> {
    const results = await this.#geocodingService.search(name);
    return this.#findBestMatch(results);
  }

  #findBestMatch(results: SearchResult[]): Location | undefined {
    let result = results.find(result => result.category === 'boundary');
    if (!result && results.length > 0) {
      result = results[0];
    }

    if (!result) {
      return undefined;
    }

    return ({
      name: result.display_name,
      lat: +result.lat,
      lng: +result.lng,
      timezone: tz_lookup(+result.lat, +result.lng)
    });
  }
}
