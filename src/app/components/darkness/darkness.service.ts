import { Injectable } from '@angular/core';
import { Darkness } from './darkness';
import * as SunCalc from 'suncalc';
import { DarknessSections } from './darkness-sections';

@Injectable({
  providedIn: 'root'
})
export class DarknessService {

  constructor() { }

  public getDarknessForYear(year: number, lat: number, lng: number): Darkness[] {
    const darkness = new Array<Darkness>();
    let today = new Date(year, 1, 1);

    while(today.getFullYear() == year) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const todayTimes = SunCalc.getTimes(today, lat, lng);
      const tomorrowTimes = SunCalc.getTimes(tomorrow, lat, lng);

      darkness.push(Darkness.create(todayTimes, tomorrowTimes));

      today = tomorrow;
    }

    return darkness;
  }

  public getDarknessForMonth(year: number, month: number, lat: number, lng: number): Darkness[] {
    const darkness = new Array<Darkness>();
    let today = new Date(Date.UTC(year, month, 1));

    while(today.getMonth() == month) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const todayTimes = SunCalc.getTimes(today, lat, lng);
      const tomorrowTimes = SunCalc.getTimes(tomorrow, lat, lng);

      const todayMoonTimes = SunCalc.getMoonTimes(today, lat, lng);
      const tomorrowMoonTimes = SunCalc.getMoonTimes(tomorrow, lat, lng);

      darkness.push(Darkness.createWithMoon(todayTimes, tomorrowTimes, todayMoonTimes, tomorrowMoonTimes));

      today = tomorrow;
    }

    return darkness;
  }

  public getInfiniteDarkness(year: number, month: number, lat: number, lng: number): DarknessSections[] {
    const darkness = new Array<DarknessSections>();
    let today = new Date(Date.UTC(year, month, 1));

    while(today.getMonth() == month) {
      const tomorrow = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));
      
      const todayTimes = SunCalc.getTimes(today, lat, lng);
      const tomorrowTimes = SunCalc.getTimes(tomorrow, lat, lng);

      const todayMoonTimes = SunCalc.getMoonTimes(today, lat, lng);
      const tomorrowMoonTimes = SunCalc.getMoonTimes(tomorrow, lat, lng);

      darkness.push(DarknessSections.create(todayTimes, tomorrowTimes, todayMoonTimes, tomorrowMoonTimes));

      today = tomorrow;
    }

    return darkness;
  }

  public getDarknessForDay(today: Date, lat: number, lng: number): DarknessSections {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayTimes = SunCalc.getTimes(today, lat, lng);
    const tomorrowTimes = SunCalc.getTimes(tomorrow, lat, lng);

    const todayMoonTimes = SunCalc.getMoonTimes(today, lat, lng);
    const tomorrowMoonTimes = SunCalc.getMoonTimes(tomorrow, lat, lng);

    return DarknessSections.create(todayTimes, tomorrowTimes, todayMoonTimes, tomorrowMoonTimes);
  }
}
