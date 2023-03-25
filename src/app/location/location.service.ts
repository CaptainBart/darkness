import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from './location.model';

const LOCALSTORAGE_KEY = 'darkness.location';
const hasLocation = () => window.localStorage.getItem(LOCALSTORAGE_KEY) ? true : false;
const fetchLocationFromStorage = (): Location|undefined => JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY));
const storeLocationToStorage = (location: Location) => window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(location));

@Injectable({providedIn: 'root'})
export class LocationService {
  #locationSubject = new BehaviorSubject<Location|undefined>(fetchLocationFromStorage());
  location$: Observable<Location|undefined> = this.#locationSubject.asObservable();

  #hasLocationSubject = new BehaviorSubject<boolean>(hasLocation());
  public hasLocation$: Observable<boolean> = this.#hasLocationSubject.asObservable();

  public hasLocation(): boolean
  {
    return hasLocation();
  }

  public changeLocation(location: Location)
  {
    storeLocationToStorage(location);
    this.#locationSubject.next(fetchLocationFromStorage());
    this.#hasLocationSubject.next(hasLocation());
  }
}
