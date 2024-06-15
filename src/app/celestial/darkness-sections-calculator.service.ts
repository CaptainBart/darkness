import { Injectable, inject } from '@angular/core';
import { Location } from '@app/location';
import { isAfter, isBefore } from 'date-fns';
import { CelestialCalculatorService } from './celestial-calculator.service';
import { CelestialEvents } from './celestial-events.model';
import { DarknessSections, Section, SectionType } from './darkness-sections.model';

const happensBetween = (event: Date | undefined, after: Date, before: Date): boolean => {
  if (event == undefined) {
    return false;
  }

  return isAfter(event, after) && isBefore(event, before);
}

const createSection = (type: SectionType, startsAt: Date, endsAt: Date): Section => {
  const totalMinutes = (endsAt.getTime() - startsAt.getTime()) / 1000 / 60;
  return {
    type,
    startsAt,
    endsAt,
    totalMinutes,
  };
};

@Injectable({ providedIn: 'root' })
export class DarknessSectionsCalculatorService {
  #calculator = inject(CelestialCalculatorService);

  createSections(date: Date, location: Location): DarknessSections {
    const events = this.#calculator.createCelestialEvents(date, location);
    const sections: Section[] = [];
    this.#addDaylightSections(sections, events);

    return {
      events,
      sections,
    };
  }

  #addDaylightSections(sections: Section[], events: CelestialEvents): void {
    let momentPointer = events.startDate;

    if (events.sunUpAtStart) {
      if (events.sunset == undefined) {
        sections.push(createSection(SectionType.DAY, momentPointer, events.endDate));
        return;
      }

      sections.push(createSection(SectionType.DAY, momentPointer, events.sunset));
      momentPointer = events.sunset;
    }

    momentPointer = this.#addCivilTWilightSections(sections, events, momentPointer);

    if (momentPointer < events.endDate) {
      sections.push(createSection(SectionType.DAY, momentPointer, events.endDate));
    }
  }

  #addCivilTWilightSections(sections: Section[], events: CelestialEvents, momentPointer: Date): Date {
    const civilDawnEnd = events.civilDawnEnd ?? events.endDate;

    if (events.civilDuskEnd == undefined) {
      sections.push(createSection(SectionType.TWILIGHT, momentPointer, civilDawnEnd));
      return civilDawnEnd;
    }

    sections.push(createSection(SectionType.TWILIGHT, momentPointer, events.civilDuskEnd));
    momentPointer = events.civilDuskEnd;

    momentPointer = this.#addNauticalTWilightSections(sections, events, momentPointer);

    if (momentPointer < civilDawnEnd) {
      sections.push(createSection(SectionType.TWILIGHT, momentPointer, civilDawnEnd));
    }

    return civilDawnEnd;
  }

  #addNauticalTWilightSections(sections: Section[], events: CelestialEvents, momentPointer: Date): Date {
    const nauticalDawnEnd = events.nauticalDawnEnd ?? events.endDate;

    if (events.nauticalDuskEnd == undefined) {
      sections.push(createSection(SectionType.NAUTICAL_TWILIGHT, momentPointer, nauticalDawnEnd));
      return nauticalDawnEnd;
    }

    sections.push(createSection(SectionType.NAUTICAL_TWILIGHT, momentPointer, events.nauticalDuskEnd));
    momentPointer = events.nauticalDuskEnd;

    momentPointer = this.#addAstronomicalTWilightSections(sections, events, momentPointer);

    if (momentPointer < nauticalDawnEnd) {
      sections.push(createSection(SectionType.NAUTICAL_TWILIGHT, momentPointer, nauticalDawnEnd));
    }

    return nauticalDawnEnd;
  }

  #addAstronomicalTWilightSections(sections: Section[], events: CelestialEvents, momentPointer: Date): Date {
    const astronomicalDawnEnd = events.astronomicalDawnEnd ?? events.endDate;

    if (events.astronomicalDuskEnd == undefined) {
      sections.push(createSection(SectionType.ASTRONOMICAL_TWILIGHT, momentPointer, astronomicalDawnEnd));
      return astronomicalDawnEnd;
    }

    sections.push(createSection(SectionType.ASTRONOMICAL_TWILIGHT, momentPointer, events.astronomicalDuskEnd));
    momentPointer = events.astronomicalDuskEnd;

    momentPointer = this.#addNightSections(sections, events, momentPointer);

    if (momentPointer < astronomicalDawnEnd) {
      sections.push(createSection(SectionType.ASTRONOMICAL_TWILIGHT, momentPointer, astronomicalDawnEnd));
    }

    return astronomicalDawnEnd;
  }

  #addNightSections(sections: Section[], events: CelestialEvents, momentPointer: Date): Date {
    const nightEnd = events.nightEnd ?? events.endDate;

    if (events.moonupAtNightStart) {
      if (events.moonset == undefined || !happensBetween(events.moonset, momentPointer, nightEnd)) {
        sections.push(createSection(SectionType.MOON, momentPointer, nightEnd));
        return nightEnd;
      }

      sections.push(createSection(SectionType.MOON, momentPointer, events.moonset));
      momentPointer = events.moonset;
    }

    if (events.moonrise == undefined || !happensBetween(events.moonrise, momentPointer, nightEnd)) {
      sections.push(createSection(SectionType.NIGHT, momentPointer, nightEnd));
      return nightEnd;
    }

    sections.push(createSection(SectionType.NIGHT, momentPointer, events.moonrise));
    sections.push(createSection(SectionType.MOON, events.moonrise, nightEnd));
    return nightEnd;
  }
}
