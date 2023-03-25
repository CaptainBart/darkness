import { addDays, differenceInMinutes, isAfter, isBefore, isDate } from 'date-fns';
import { CelestialInfo } from './celestial-info';
import { Location } from '@app/location';

export class CelestialEvents
{
    public constructor(public readonly todayEvents: CelestialInfo, public readonly tomorrowEvents: CelestialInfo) {
    }

    public static create(date: Date, location: Location): CelestialEvents
    {
        const today = CelestialInfo.create(date, location);
        const tomorrow = CelestialInfo.create(addDays(date, 1), location);
        return new CelestialEvents(today, tomorrow);
    }

    public get location(): Location {
        return this.todayEvents.location;
    }

    public get startDate(): Date {
        return this.todayEvents.noon;
    }

    public get endDate(): Date {
        return this.tomorrowEvents.noon;
    }

    public get sunUpAtStart(): boolean {
        return this.todayEvents.sunUpAtNoon;
    }

    public get civilTwilightAtStart(): boolean {
        return this.todayEvents.civilTwilightAtNoon;
    }

    public get nauticalTwilightAtStart(): boolean {
        return this.todayEvents.nauticalTwilightAtNoon;
    }

    public get astronomicalTwilightAtStart(): boolean {
        return this.todayEvents.astronomicalTwilightAtNoon;
    }

    public get nightAtStart(): boolean {
        return this.todayEvents.darkAtNoon;
    }

    public get moonUpAtStart(): boolean {
        return this.todayEvents.moonUpAtNoon;
    }

    public get sunset(): Date | null {
        return this.pickDateBetweenNoons(this.todayEvents.sunTimes.sunset, this.tomorrowEvents.sunTimes.sunset);
    }

    public get civilDuskStart(): Date | null {
        return this.civilTwilightAtStart ? this.startDate : this.sunset;
    }

    public get civilDuskEnd(): Date | null {
        return this.pickDateBetweenNoons(this.todayEvents.sunTimes.dusk, this.tomorrowEvents.sunTimes.dusk);
    }

    public get nauticalDuskStart(): Date | null {
        return this.nauticalTwilightAtStart ? this.startDate : this.civilDuskEnd;
    }

    public get nauticalDuskEnd(): Date | null {
        return this.pickDateBetweenNoons(this.todayEvents.sunTimes.nauticalDusk, this.tomorrowEvents.sunTimes.nauticalDusk);
    }

    public get astronomicalDuskStart(): Date | null {
        return this.astronomicalTwilightAtStart ? this.startDate : this.nauticalDuskEnd;
    }

    public get astronomicalDuskEnd(): Date | null {
        const nightStart = this.pickDateBetweenNoons(this.todayEvents.sunTimes.night, this.tomorrowEvents.sunTimes.night);
        const nightEnd = this.pickDateBetweenNoons(this.todayEvents.sunTimes.nightEnd, this.tomorrowEvents.sunTimes.nightEnd);

        if(nightStart != null && nightEnd == null) {
            return null;
        }

        return nightStart;
    }

    public get nightStart(): Date | null {
        if(this.nightAtStart) {
            return this.startDate;
         }

         const nightStart = this.pickDateBetweenNoons(this.todayEvents.sunTimes.night, this.tomorrowEvents.sunTimes.night);
         const nightEnd = this.pickDateBetweenNoons(this.todayEvents.sunTimes.nightEnd, this.tomorrowEvents.sunTimes.nightEnd);

         if(nightStart != null && nightEnd == null) {
             return null;
         }

         return nightStart;
    }

    public get nightEnd(): Date | null {
        return this.astronomicalDawnStart ?? this.astronomicalDawnEnd;
    }

    public get astronomicalDawnStart(): Date | null {
        return this.pickDateBetweenNoons(this.todayEvents.sunTimes.nightEnd, this.tomorrowEvents.sunTimes.nightEnd);
    }

    public get astronomicalDawnEnd(): Date | null {
        return this.nauticalDawnStart ?? this.nauticalDawnEnd;
    }

    public get nauticalDawnStart(): Date | null {
        return this.pickDateBetweenNoons(this.todayEvents.sunTimes.nauticalDawn, this.tomorrowEvents.sunTimes.nauticalDawn);
    }

    public get nauticalDawnEnd(): Date | null {
        return this.civilDawnStart ?? this.civilDawnEnd;
    }

    public get civilDawnStart(): Date | null {
        return this.pickDateBetweenNoons(this.todayEvents.sunTimes.dawn, this.tomorrowEvents.sunTimes.dawn);
    }

    public get civilDawnEnd(): Date | null {
        return this.sunrise ?? this.endDate;
    }

    public get sunrise(): Date | null {
        return this.pickDateBetweenNoons(this.todayEvents.sunTimes.sunrise, this.tomorrowEvents.sunTimes.sunrise);
    }

    public get moonrise(): Date | null {
        return this.pickDateBetweenNoons(this.todayEvents.moonTimes.rise, this.tomorrowEvents.moonTimes.rise);
    }

    public get moonset(): Date | null {
        return this.pickDateBetweenNoons(this.todayEvents.moonTimes.set, this.tomorrowEvents.moonTimes.set);
    }

    public happensAtNight(event: Date | null): boolean {
        if(event == null || !isDate(event)) {
            return false;
        }

        return isAfter(event, this.astronomicalDuskEnd) && isBefore(event, this.astronomicalDawnStart);
    }

    public get moonupAtNightStart(): boolean {
        const nightStart= this.nightStart;
        if (nightStart == null) {
            return false;
        }

        const moonrise = this.moonrise;
        const moonset = this.moonset;

        if(this.moonUpAtStart) {
            return moonset == null 
                || isAfter(moonset, nightStart)
                || isBefore(moonset, nightStart) && isBefore(moonrise, nightStart);
        }

        return moonrise != null 
                && isBefore(moonrise, nightStart) 
                && (moonset == null || isAfter(moonset, nightStart));
    }

    public get moonUpAtNightEnd(): boolean {
        const nightEnd = this.nightEnd;
        if (nightEnd == null) {
            return false;
        }

        const moonrise = this.moonrise;
        const moonset = this.moonset;

        if(this.moonupAtNightStart) {
            return moonset == null || isAfter(moonset, nightEnd);
        }

        return moonrise != null && isBefore(moonrise, nightEnd);
    }

    private pickDateBetweenNoons(today: Date, tomorrow: Date): Date | null
    {
        if (today != null && isDate(today) && isAfter(today, this.todayEvents.noon)) {
            return today;
        }

        if (tomorrow != null && isDate(tomorrow) && isBefore(tomorrow, this.tomorrowEvents.noon)) {
            return tomorrow;
        }

        return null;
    }

    public get totalMinutesBetweenNoons(): number {
        return differenceInMinutes(this.tomorrowEvents.noon, this.todayEvents.noon);
    }
}