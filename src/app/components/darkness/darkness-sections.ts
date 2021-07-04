import * as SunCalc from 'suncalc';

export class DarknessSections {
    public sunset: Date | null = null;
    public dusk: Date | null = null;
    public nauticalDusk: Date | null = null;
    public night: Date | null = null;
    public nightEnd: Date | null = null;
    public nauticalDawn: Date| null = null;
    public dawn: Date| null = null;
    public sunrise: Date| null = null;

    public moonUpAtStart: boolean = false;
    public moonUpAtEnd: boolean = false;
    public moonrise: Date| null = null;
    public moonset: Date| null = null;

    public sections: Section[] = [];

    public static create(today: SunCalc.GetTimesResult, tomorrow: SunCalc.GetTimesResult, todayMoon: SunCalc.GetMoonTimes, tomorrowMoon: SunCalc.GetMoonTimes): DarknessSections {
        const darkness = new DarknessSections(today.solarNoon, tomorrow.solarNoon);
        darkness.sunset = darkness.getDateThatIsOwned(today.sunset, tomorrow.sunset);
        darkness.dusk = darkness.getDateThatIsOwned(today.dusk, tomorrow.dusk);
        darkness.nauticalDusk = darkness.getDateThatIsOwned(today.nauticalDusk, tomorrow.nauticalDusk);
        darkness.night = darkness.getDateThatIsOwned(today.night, tomorrow.night);
        darkness.nightEnd = darkness.getDateThatIsOwned(today.nightEnd, tomorrow.nightEnd);
        darkness.nauticalDawn = darkness.getDateThatIsOwned(today.nauticalDawn, tomorrow.nauticalDawn);
        darkness.dawn = darkness.getDateThatIsOwned(today.dawn, tomorrow.dawn);
        darkness.sunrise = darkness.getDateThatIsOwned(today.sunrise, tomorrow.sunrise);

        darkness.moonrise = darkness.getDateThatIsOwned(todayMoon.rise, tomorrowMoon.rise);
        darkness.moonset = darkness.getDateThatIsOwned(todayMoon.set, tomorrowMoon.set);

        const moonSetsAfterMoonRise = isADate(todayMoon.rise) && isADate(todayMoon.set) && todayMoon.rise.getTime() <= todayMoon.set.getTime(); 
        const moonRisesBeforeSolarNoon = todayMoon.alwaysUp || isADate(todayMoon.rise) && todayMoon.rise.getTime() <= today.solarNoon.getTime();
        const moonSetsBeforeSolarNoon = todayMoon.alwaysDown ||  moonSetsAfterMoonRise && todayMoon.set.getTime() <= today.solarNoon.getTime();
        darkness.moonUpAtStart = moonRisesBeforeSolarNoon && !moonSetsBeforeSolarNoon;

        if(darkness.sunset === null) {
            darkness.addSection(new Section(SectionType.DAY, darkness.startsAt, darkness.endsAt));
            return darkness;
        }

        let sectionStart = darkness.startsAt;
        
        if(darkness.sunset !== null && darkness.sunrise !== null) {
            darkness.addSection(new Section(SectionType.DAY, sectionStart, darkness.sunset));
            sectionStart = darkness.sunset;

            if(darkness.dusk !== null && darkness.dawn !== null) {
                darkness.addSection(new Section(SectionType.TWILIGHT, sectionStart, darkness.dusk));
                sectionStart = darkness.dusk;

                if(darkness.nauticalDusk !== null && darkness.nauticalDawn !== null) {
                    darkness.addSection(new Section(SectionType.NAUTICAL_TWILIGHT, sectionStart, darkness.nauticalDusk));
                    sectionStart = darkness.nauticalDusk;
                    
                    if(darkness.night !== null && darkness.nightEnd !== null) {
                        darkness.addSection(new Section(SectionType.ASTRONOMICAL_TWILIGHT, sectionStart, darkness.night));
                        sectionStart = darkness.night;

                        if(darkness.moonUpWhenNightStarts && darkness.moonUpWhenNightEnds) {
                            darkness.addSection(new Section(SectionType.MOON, sectionStart, darkness.nightEnd));
                            sectionStart = darkness.nightEnd;
                        } else if(darkness.moonUpWhenNightStarts && darkness.moonSetsAtNight) {
                            darkness.addSection(new Section(SectionType.MOON, sectionStart, darkness.moonset));
                            sectionStart = darkness.moonset;
                            darkness.addSection(new Section(SectionType.NIGHT, sectionStart, darkness.nightEnd));
                            sectionStart = darkness.nightEnd;
                        } else if(darkness.moonRisesAtNight) {
                            darkness.addSection(new Section(SectionType.NIGHT, sectionStart, darkness.moonrise));
                            sectionStart = darkness.moonrise;
                            darkness.addSection(new Section(SectionType.MOON, sectionStart, darkness.nightEnd));
                            sectionStart = darkness.nightEnd;
                        } else {
                            darkness.addSection(new Section(SectionType.NIGHT, sectionStart, darkness.nightEnd));
                            sectionStart = darkness.nightEnd;
                        }
                    }

                    darkness.addSection(new Section(SectionType.ASTRONOMICAL_TWILIGHT, sectionStart, darkness.nauticalDawn));
                    sectionStart = darkness.nauticalDawn;
                }

                darkness.addSection(new Section(SectionType.NAUTICAL_TWILIGHT, sectionStart, darkness.dawn));
                sectionStart = darkness.dawn;
            }

            darkness.addSection(new Section(SectionType.TWILIGHT, sectionStart, darkness.sunrise));
            sectionStart = darkness.sunrise;
        } 

        darkness.addSection(new Section(SectionType.DAY, sectionStart, darkness.endsAt));
        return darkness;
    }

    public constructor(public readonly startsAt: Date, public readonly endsAt: Date) {
    }

    public addSection(section: Section): void {
        this.sections.push(section);
    }

    public get startDate(): Date {
        return midnight(this.startsAt);
    }

    public get endDate(): Date {
        return midnight(this.endsAt);
    }

    public get totalMinutes(): number {
        return (this.endsAt.getTime() - this.startsAt.getTime()) / 1000 / 60;
    }

    public get moonUpWhenNightStarts(): boolean {
        if(!isADate(this.night)) {
            return false;
        }

        if(isADate(this.moonrise) && this.moonrise.getTime() <= this.night.getTime()) {
            return true;
        };

        if(!this.moonUpAtStart) {
            return false;
        }

        if(!isADate(this.moonset)) {
            return true;
        }

        return this.moonset.getTime() > this.night.getTime();
    }

    public get moonSetsAtNight(): boolean {
        if(!isADate(this.night) || !isADate(this.nightEnd) || !isADate(this.moonset)) {
            return false;
        }

        return isBetween(this.moonset, this.night, this.nightEnd);
    }

    public get moonRisesAtNight(): boolean {
        if(!isADate(this.night)|| !isADate(this.nightEnd) || !isADate(this.moonrise)) {
            return false;
        }

        return isBetween(this.moonrise, this.night, this.nightEnd);
    }

    public get moonUpWhenNightEnds(): boolean {
        if(!isADate(this.nightEnd)) {
            return false;
        }

        // if(isADate(this.moonset) && isADate(this.moonrise) && this.moonset.getTime() <= this.moonrise.getTime()) {
        //     return this.moonUpWhenNightStarts || this.moonRisesAtNight;
        // }

        return isADate(this.moonset) ?  this.nightEnd.getTime() <= this.moonset.getTime() : (this.moonUpWhenNightStarts || this.moonRisesAtNight);
    }

    public ownsDate(date: Date): boolean {
        return isBetween(date, this.startsAt, this.endsAt);
    }

    public getDateThatIsOwned(today: Date, tomorrow: Date): Date | null {
        if(isADate(today) && this.ownsDate(today)) {
            return today;
        }

        if(isADate(tomorrow) && this.ownsDate(tomorrow)) {
            return tomorrow;
        }

        return null;
    }
}

export class Section {
    public constructor(public readonly type: SectionType, public readonly startsAt: Date, public readonly endsAt: Date) {
    }

    public get totalMinutes(): number {
        return (this.endsAt.getTime() - this.startsAt.getTime()) / 1000 / 60;
    }
}

export enum SectionType {
    DAY = 1,
    TWILIGHT = 2,
    NAUTICAL_TWILIGHT = 3,
    ASTRONOMICAL_TWILIGHT = 4,
    NIGHT = 5,
    MOON = 6,
}

function isADate(date: Date | null | undefined): boolean {
    if(date == null || date == undefined) {
        return false;
    }
    return !isNaN(date.getTime());
}

function isBetween(date: Date, startDate: Date, endDate: Date) {
    return startDate.getTime() <= date.getTime() && date.getTime() <= endDate.getTime();
}

function midnight(date: Date): Date {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);
    return midnight;
}
