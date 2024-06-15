import { Injectable } from '@angular/core';
import { Location } from "@app/location";
import { addDays, differenceInMinutes, isAfter, isBefore, isDate, startOfDay } from 'date-fns';
import * as SunCalc from 'suncalc';
import { CelestialEvents } from './celestial-events.model';
import { CelestialInfo } from "./celestial-info.model";

const sunriseAltitude = 0;
const moonriseAltitude = 0;
const civilTwilightAltitude = -6;
const nauticalTwilightAltitude = -12;
const astronomicalTwilightAltitude = -18;

type pickEventDateFn = (today: Date, tomorrow: Date) => Date | undefined;

const createEventPicker = (startDate: Date, endDate: Date): pickEventDateFn => {
  return (today: Date, tomorrow: Date): Date | undefined => {
    if (isDate(today) && isAfter(today, startDate)) {
      return today;
    }

    if (isDate(tomorrow) && isBefore(tomorrow, endDate)) {
      return tomorrow;
    }

    return undefined;
  };
};

const moonUpAtNightStart = (events: Partial<CelestialEvents>): boolean => {
  if (events.nightStart == undefined) {
    return false;
  }

  if (events.moonUpAtStart) {
    return events.moonset == undefined
      || isAfter(events.moonset, events.nightStart)
      || isBefore(events.moonset, events.nightStart) && events.moonrise != undefined && isBefore(events.moonrise, events.nightStart);
  }

  return events.moonrise != undefined
    && isBefore(events.moonrise, events.nightStart)
    && (events.moonset == undefined || isAfter(events.moonset, events.nightStart));
};

const moonUpAtNightEnd = (events: Partial<CelestialEvents>): boolean => {
  if (events.nightEnd == undefined) {
    return false;
  }

  if (events.moonupAtNightStart) {
    return events.moonset == null || isAfter(events.moonset, events.nightEnd);
  }

  return events.moonrise != null && isBefore(events.moonrise, events.nightEnd);
};

@Injectable({ providedIn: 'root' })
export class CelestialCalculatorService {
  createCelestialInfo(date: Date, location: Location): CelestialInfo {
    const midnight = startOfDay(date);
    const midnightUTC = new Date(Date.UTC(midnight.getFullYear(), midnight.getMonth(), midnight.getDate()));

    const sunTimes = SunCalc.getTimes(midnightUTC, location.lat, location.lng);
    const moonTimes = SunCalc.getMoonTimes(sunTimes.solarNoon, location.lat, location.lng);
    const sunAtNoon = SunCalc.getPosition(sunTimes.solarNoon, location.lat, location.lng);
    const moonAtNoon = SunCalc.getMoonPosition(sunTimes.solarNoon, location.lat, location.lng);

    return {
      sunTimes,
      moonTimes,
      timezone: location.timezone,
      noon: sunTimes.solarNoon,
      sunUpAtNoon: sunAtNoon.altitude >= sunriseAltitude,
      civilTwilightAtNoon: sunAtNoon.altitude < sunriseAltitude && sunAtNoon.altitude >= civilTwilightAltitude,
      nauticalTwilightAtNoon: sunAtNoon.altitude < civilTwilightAltitude && sunAtNoon.altitude >= nauticalTwilightAltitude,
      astronomicalTwilightAtNoon: sunAtNoon.altitude < civilTwilightAltitude && sunAtNoon.altitude >= astronomicalTwilightAltitude,
      darkAtNoon: sunAtNoon.altitude < astronomicalTwilightAltitude,
      moonUpAtNoon: moonAtNoon.altitude >= moonriseAltitude,
    }
  }

  createCelestialEvents(date: Date, location: Location): CelestialEvents {
    const today = this.createCelestialInfo(date, location);
    const tomorrow = this.createCelestialInfo(addDays(date, 1), location);
    const pickEventBetweenNoons = createEventPicker(today.noon, tomorrow.noon);

    const nightEnd = pickEventBetweenNoons(today.sunTimes.nightEnd, tomorrow.sunTimes.nightEnd);
    const nightStart = nightEnd == undefined ? undefined : pickEventBetweenNoons(today.sunTimes.night, tomorrow.sunTimes.night);

    let events: Partial<CelestialEvents> = {
      startDate: today.noon,
      endDate: tomorrow.noon,
      timezone: location.timezone,
      totalMinutesBetweenNoons: differenceInMinutes(tomorrow.noon, today.noon),
      sunUpAtStart: today.sunUpAtNoon,
      civilTwilightAtStart: today.civilTwilightAtNoon,
      nauticalTwilightAtStart: today.nauticalTwilightAtNoon,
      astronomicalTwilightAtStart: today.astronomicalTwilightAtNoon,
      nightAtStart: today.darkAtNoon,
      moonUpAtStart: today.moonUpAtNoon,

      sunset: pickEventBetweenNoons(today.sunTimes.sunset, tomorrow.sunTimes.sunset),
      civilDuskEnd: pickEventBetweenNoons(today.sunTimes.dusk, tomorrow.sunTimes.dusk),
      nauticalDuskEnd: pickEventBetweenNoons(today.sunTimes.nauticalDusk, tomorrow.sunTimes.nauticalDusk),
      astronomicalDuskEnd: nightStart,

      astronomicalDawnStart: pickEventBetweenNoons(today.sunTimes.nightEnd, tomorrow.sunTimes.nightEnd),
      nauticalDawnStart: pickEventBetweenNoons(today.sunTimes.nauticalDawn, tomorrow.sunTimes.nauticalDawn),
      civilDawnStart: pickEventBetweenNoons(today.sunTimes.dawn, tomorrow.sunTimes.dawn),
      sunrise: pickEventBetweenNoons(today.sunTimes.sunrise, tomorrow.sunTimes.sunrise),
      moonrise: pickEventBetweenNoons(today.moonTimes.rise, tomorrow.moonTimes.rise),
      moonset: pickEventBetweenNoons(today.moonTimes.set, tomorrow.moonTimes.set),
    };

    events = {
      ...events,
      civilDuskStart: events.civilTwilightAtStart ? events.startDate : events.sunset,
      nauticalDuskStart: events.nauticalTwilightAtStart ? events.startDate : events.civilDuskEnd,
      astronomicalDuskStart: events.astronomicalTwilightAtStart ? events.startDate : events.nauticalDuskEnd,
      nightStart: events.nightAtStart ? events.startDate : events.astronomicalDuskEnd,
      civilDawnEnd: events.sunrise ?? events.endDate,
    }

    events = {
      ...events,
      nauticalDawnEnd: events.civilDawnStart ?? events.civilDawnEnd,
    }

    events = {
      ...events,
      astronomicalDawnEnd: events.nauticalDawnStart ?? events.nauticalDawnEnd,
    }

    events = {
      ...events,
      nightEnd: events.astronomicalDawnStart ?? events.astronomicalDawnEnd,
    }

    events = {
      ...events,
      moonupAtNightStart: moonUpAtNightStart(events),
      moonUpAtNightEnd: moonUpAtNightEnd(events),
    }

    return events as CelestialEvents;
  }
}
