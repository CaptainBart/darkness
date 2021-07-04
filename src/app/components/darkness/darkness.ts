import * as SunCalc from 'suncalc';

export class Darkness {
    startDate: Date;
    endDate: Date;
    solarNoon: Date;
    sunset: Date;
    dusk: Date;
    nauticalDusk: Date;
    night: Date;
    nightEnd: Date;
    nauticalDawn: Date;
    dawn: Date;
    sunrise: Date;
    nextSolarNoon: Date;
    moonrise: Date;
    moonset: Date;
    nightlyMoonrise: Date;
    nightlyMoonset: Date;

    afterNoonMinutes: number;
    duskMinutes: number;
    nauticalDuskMinutes: number;
    astronomicalDuskMinutes: number;
    nightMinutes: number;
    astronomicalDawnMinutes: number;
    nauticalDawnMinutes: number;
    dawnMinutes: number;
    beforeNoonMinutes: number;

    nightBeforeMoonriseMinutes: number;
    nightAfterMoonsetMinutes: number;
    moonMinutes: number;

    private constructor() {

    }

    public static create(todayTimes: SunCalc.GetTimesResult, tomorrowTimes: SunCalc.GetTimesResult): Darkness {
        const darkness = new Darkness();
        darkness.startDate = new Date(todayTimes.solarNoon);
        darkness.startDate.setHours(0,0,0,0);
        darkness.endDate = new Date(tomorrowTimes.solarNoon);
        darkness.endDate.setHours(0,0,0,0);
        darkness.solarNoon = todayTimes.solarNoon;
        darkness.sunset = todayTimes.sunset;
        darkness.dusk = todayTimes.dusk;
        darkness.nauticalDusk = todayTimes.nauticalDusk < todayTimes.solarNoon ? tomorrowTimes.nauticalDusk : todayTimes.nauticalDusk;
        darkness.night = todayTimes.night < todayTimes.solarNoon ? tomorrowTimes.night : todayTimes.night;
        darkness.nightEnd = tomorrowTimes.nightEnd;
        darkness.nauticalDawn = tomorrowTimes.nauticalDawn;
        darkness.dawn = tomorrowTimes.dawn;
        darkness.sunrise = tomorrowTimes.sunrise;
        darkness.nextSolarNoon = tomorrowTimes.solarNoon;

        darkness.night = isNaN(darkness.night.getTime()) ? tomorrowTimes.nadir : darkness.night; 
        darkness.nightEnd = isNaN(darkness.nightEnd.getTime()) ? tomorrowTimes.nadir : darkness.nightEnd;

        darkness.afterNoonMinutes = this.diffMinutes(darkness.sunset, darkness.solarNoon);
        darkness.duskMinutes = this.diffMinutes(darkness.dusk, darkness.sunset);
        darkness.nauticalDuskMinutes = this.diffMinutes(darkness.nauticalDusk, darkness.dusk);
        darkness.astronomicalDuskMinutes = this.diffMinutes(darkness.night, darkness.nauticalDusk);

        darkness.nightMinutes = this.diffMinutes(darkness.nightEnd, darkness.night);

        darkness.astronomicalDawnMinutes = this.diffMinutes(darkness.nauticalDawn, darkness.nightEnd);
        darkness.nauticalDawnMinutes = this.diffMinutes(darkness.dawn, darkness.nauticalDawn);
        darkness.dawnMinutes = this.diffMinutes(darkness.sunrise, darkness.dawn);

        darkness.beforeNoonMinutes = this.diffMinutes(darkness.nextSolarNoon, darkness.sunrise);

        return darkness;
    }

    public static createWithMoon(todayTimes: SunCalc.GetTimesResult, tomorrowTimes: SunCalc.GetTimesResult, todayMoon: SunCalc.GetMoonTimes, tomorrowMoon: SunCalc.GetMoonTimes): Darkness {
        const darkness = Darkness.create(todayTimes, tomorrowTimes);
        if(todayMoon.rise > darkness.night && todayMoon.rise < darkness.nightEnd) {
            darkness.moonrise = todayMoon.rise;
        } else if(tomorrowMoon.rise > darkness.night && tomorrowMoon.rise < darkness.nightEnd) {
            darkness.moonrise = tomorrowMoon.rise;
        } else if(todayMoon.rise > todayTimes.solarNoon) {
            darkness.moonrise = darkness.night;
        }

        if(todayMoon.set > darkness.night && todayMoon.set < darkness.nightEnd) {
            darkness.moonset = todayMoon.set;
        } else if(tomorrowMoon.set > darkness.night && tomorrowMoon.set < darkness.nightEnd) {
            darkness.moonset = tomorrowMoon.set;
        } else if (tomorrowMoon.set < tomorrowTimes.solarNoon) {
            darkness.moonset = darkness.nightEnd;
        }

        if(isNaN(todayTimes.night.getTime()) || isNaN(todayTimes.nightEnd.getTime())) {
            darkness.nightBeforeMoonriseMinutes = 0;
            darkness.moonMinutes = 0;
            darkness.nightAfterMoonsetMinutes = 0;   
        } else {
            if(darkness.moonrise && darkness.moonset) {
                darkness.nightBeforeMoonriseMinutes = Darkness.diffMinutes(darkness.moonrise, darkness.night);
                darkness.moonMinutes = Darkness.diffMinutes(darkness.moonset, darkness.moonrise);
                darkness.nightAfterMoonsetMinutes = Darkness.diffMinutes(darkness.nightEnd, darkness.moonset);
            }else if(darkness.moonrise) {
                darkness.nightBeforeMoonriseMinutes = Darkness.diffMinutes(darkness.moonrise, darkness.night);
                darkness.moonMinutes = Darkness.diffMinutes(darkness.nightEnd, darkness.moonrise);
                darkness.nightAfterMoonsetMinutes = 0;
            } else if(darkness.moonset) {
                darkness.nightBeforeMoonriseMinutes = 0;
                darkness.moonMinutes = Darkness.diffMinutes(darkness.moonset, darkness.night);
                darkness.nightAfterMoonsetMinutes = Darkness.diffMinutes(darkness.nightEnd, darkness.moonset);
            } else {
                darkness.nightBeforeMoonriseMinutes = darkness.nightMinutes;
                darkness.moonMinutes = 0;
                darkness.nightAfterMoonsetMinutes = 0;
            }

        }
        
        return darkness;
    }

    private static diffMinutes(date: Date, otherDate: Date) {
        const diff = Math.max(0, Math.ceil(Math.abs(date.getTime() - otherDate.getTime()) / (1000 * 60)));
        return isNaN(diff) ? 0 : diff;
      }
}