import { startOfDay } from 'date-fns';
import { GeoLocation } from './geo-location';
import * as SunCalc from 'suncalc';

export class CelestialInfo
{
    public readonly noon: Date;

    public constructor(
        public readonly location: GeoLocation,
        public readonly sunTimes: SunCalc.GetTimesResult,
        public readonly moonTimes: SunCalc.GetMoonTimes,
        public readonly sunAtNoon: SunCalc.GetSunPositionResult,
        public readonly moonAtNoon: SunCalc.GetMoonPositionResult
    ) {
        this.noon = this.sunTimes.solarNoon;
    }

    public static create(date: Date, location: GeoLocation): CelestialInfo
    {
        const midnight = startOfDay(date);
        const midnightUTC = new Date(Date.UTC(midnight.getFullYear(), midnight.getMonth(), midnight.getDate()));
        
        const sunTimes = SunCalc.getTimes(midnightUTC, location.lat, location.lng);
        const moonTimes = SunCalc.getMoonTimes(sunTimes.solarNoon, location.lat, location.lng);
        const sunAtNoon = SunCalc.getPosition(sunTimes.solarNoon, location.lat, location.lng);
        const moonAtNoon = SunCalc.getMoonPosition(sunTimes.solarNoon, location.lat, location.lng);

        return new CelestialInfo(
            location,
            sunTimes,
            moonTimes,
            sunAtNoon,
            moonAtNoon
        );
    }

    public get sunUpAtNoon(): boolean {
        return this.sunAtNoon.altitude >= 0;
    }

    public get civilTwilightAtNoon(): boolean {
        return this.sunAtNoon.altitude < 0 && this.sunAtNoon.altitude >= -6;
    }

    public get nauticalTwilightAtNoon(): boolean {
        return this.sunAtNoon.altitude < -6 && this.sunAtNoon.altitude >= -12;
    }

    public get astronomicalTwilightAtNoon(): boolean {
        return this.sunAtNoon.altitude < -12 && this.sunAtNoon.altitude >= -18;
    }

    public get darkAtNoon(): boolean {
        return this.sunAtNoon.altitude < -18;
    }

    public get moonUpAtNoon(): boolean {
        return this.moonAtNoon.altitude >= 0;
    }
}