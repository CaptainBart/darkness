import { CelestialEvents } from './celestial-events';
import { GeoLocation } from './geo-location';

export class DarknessSections {
    public sections: Section[] = [];

    public constructor(private readonly events: CelestialEvents) {
        this.addDaylightSections();
    }

    public static create(date: Date, location: GeoLocation): DarknessSections
    {
        const events = CelestialEvents.create(date, location);
        return new DarknessSections(events);
    }

    public get startDate(): Date {
        return this.events.startDate;
    }

    public get totalMinutes(): number {
        return this.events.totalMinutesBetweenNoons;
    }

    private addDaylightSections(): void {
        if(this.events.sunUpAtStart) {
            if (this.events.sunset == null) {
                this.addSection(new Section(SectionType.DAY, this.events.startDate, this.events.endDate));
                return;
            }

            this.addSection(new Section(SectionType.DAY, this.events.startDate, this.events.sunset));
        }

        this.addCivilTWilightSections();

        if(this.events.sunrise != null) {
            this.addSection(new Section(SectionType.DAY, this.events.sunrise, this.events.endDate));
        }
    }

    private addCivilTWilightSections(): void {
        if(this.events.civilDuskStart != null) {
            if(this.events.civilDuskEnd == null) {
                this.addSection(new Section(SectionType.TWILIGHT, this.events.civilDuskStart, this.events.civilDawnEnd));
                return;
            }

            this.addSection(new Section(SectionType.TWILIGHT, this.events.civilDuskStart, this.events.civilDuskEnd));
        }

        this.addNauticalTWilightSections();

        if(this.events.civilDawnStart != null) {
            this.addSection(new Section(SectionType.TWILIGHT, this.events.civilDawnStart, this.events.civilDawnEnd));
        }
    }

    private addNauticalTWilightSections(): void {
        if(this.events.nauticalDuskStart != null) {
            if(this.events.nauticalDuskEnd == null) {
                this.addSection(new Section(SectionType.NAUTICAL_TWILIGHT, this.events.nauticalDuskStart, this.events.nauticalDawnEnd));
                return;
            }

            this.addSection(new Section(SectionType.NAUTICAL_TWILIGHT, this.events.nauticalDuskStart, this.events.nauticalDuskEnd));
        }

        this.addAstronomicalTwilightSections();

        if(this.events.nauticalDawnStart != null) {
            this.addSection(new Section(SectionType.NAUTICAL_TWILIGHT, this.events.nauticalDawnStart, this.events.nauticalDawnEnd));
        }
    }

    private addAstronomicalTwilightSections(): void {
        if(this.events.astronomicalDuskStart != null) {
            if(this.events.astronomicalDuskEnd == null) {
                this.addSection(new Section(SectionType.ASTRONOMICAL_TWILIGHT, this.events.astronomicalDuskStart, this.events.astronomicalDawnEnd));
                return;
            }

            this.addSection(new Section(SectionType.ASTRONOMICAL_TWILIGHT, this.events.astronomicalDuskStart, this.events.astronomicalDuskEnd));
        }

        this.addNightSections();

        if(this.events.astronomicalDawnStart != null) {
            this.addSection(new Section(SectionType.ASTRONOMICAL_TWILIGHT, this.events.astronomicalDawnStart, this.events.astronomicalDawnEnd));
        }
    }

    private addNightSections(): void {
        if(this.events.nightStart == null) {
            return;
        }

        let sectionStart = this.events.nightStart;
        
        if(this.events.moonupAtNightStart) {
            if(!this.events.happensAtNight(this.events.moonset)) {
                this.addSection(new Section(SectionType.MOON, sectionStart, this.events.nightEnd));
                return;
            }

            this.addSection(new Section(SectionType.MOON, sectionStart, this.events.moonset));
            sectionStart = this.events.moonset;
        }

        if(!this.events.happensAtNight(this.events.moonrise)) {
            this.addSection(new Section(SectionType.NIGHT, sectionStart, this.events.nightEnd));
            return;
        }

        this.addSection(new Section(SectionType.NIGHT, sectionStart, this.events.moonrise));
        sectionStart = this.events.moonrise;

        if(!this.events.moonUpAtNightEnd && this.events.happensAtNight(this.events.moonset)) {
            this.addSection(new Section(SectionType.MOON, sectionStart, this.events.moonset));
            this.addSection(new Section(SectionType.NIGHT, this.events.moonset, this.events.nightEnd));
        }

        this.addSection(new Section(SectionType.MOON, sectionStart, this.events.nightEnd));
    }

    private addSection(section: Section): void {
        this.sections.push(section);
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
