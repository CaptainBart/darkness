import { Injectable, computed, signal } from '@angular/core';
import { Location } from './location.model';

const LOCALSTORAGE_KEY = 'darkness.location';
const fetchLocationFromStorage = (): Location | undefined => {
  const persistedValue = window.localStorage.getItem(LOCALSTORAGE_KEY);
  if (!persistedValue) {
    return undefined;
  }

  return JSON.parse(persistedValue);
}

const storeLocationToStorage = (location: Location) => window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(location));

@Injectable({ providedIn: 'root' })
export class LocationService {
  readonly #location = signal(fetchLocationFromStorage());
  readonly location = this.#location.asReadonly();
  readonly hasLocation = computed(() => this.location() != undefined);

  changeLocation(location: Location) {
    storeLocationToStorage(location);
    this.#location.set(fetchLocationFromStorage());
  }
}
