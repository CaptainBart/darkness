import { Injectable } from '@angular/core';
import * as SunCalc from 'suncalc';
import { addDays } from 'date-fns';
import { DarknessSections } from './darkness-sections';
import { GeoLocation } from './geo-location';

@Injectable({
  providedIn: 'root'
})
export class DarknessService {
  constructor() { }

  public getInfiniteDarknessForMonth(year: number, month: number, location: GeoLocation): DarknessSections[] {
    const darkness = new Array<DarknessSections>();
    let today = new Date(year, month, 1);

    while(today.getMonth() == month) {
      darkness.push(DarknessSections.create(today, location));
      today = addDays(today, 1);
    }

    return darkness;
  }

  public getDarknessForDay(today: Date, location: GeoLocation): DarknessSections {
    return DarknessSections.create(today, location);
  }
}
