import { Inject, Injectable } from '@angular/core';
import { DarknessSections } from './models/darkness-sections';
import { LOCATION_TOKEN, Location } from "@app/location";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DarknessService {
  public constructor(
    @Inject(LOCATION_TOKEN)
    private readonly location$: Observable<Location|undefined>,
  ) {
  }

  public getDarknessForDay(today: Date): Observable<DarknessSections> {
    return this.location$.pipe(
      map(location => DarknessSections.create(today, location))
    );
  }
}
