import { Injectable, computed, signal } from '@angular/core';
import { Location } from './location.model';

const LOCALSTORAGE_KEY = 'darkness.location';
const fetchLocationFromStorage = (): Location|undefined => {
  const persistedValue = window.localStorage.getItem(LOCALSTORAGE_KEY);
  if (!persistedValue) {
    return undefined;
  }

  return JSON.parse(persistedValue);
}

const storeLocationToStorage = (location: Location) => window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(location));

@Injectable({providedIn: 'root'})
export class LocationService {
  #location = signal(fetchLocationFromStorage());
  location = this.#location.asReadonly();
  hasLocation = computed(() => this.location() != undefined);
  
  public changeLocation(location: Location)
  {
    storeLocationToStorage(location);
    this.#location.set(fetchLocationFromStorage());
  }
}
