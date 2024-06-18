import { Injectable, inject } from '@angular/core';
import { Location } from '@app/location';
import { isAfter, isBefore } from 'date-fns';
import { CelestialCalculatorService } from './celestial-calculator.service';
import { CelestialEvents } from './celestial-events.model';
import { DaylightSection, DaylightSectionType, DaylightSections } from './daylight-sections.model';

const happensBetween = (event: Date | undefined, after: Date, before: Date): boolean => {
  if (event == undefined) {
    return false;
  }

  return isAfter(event, after) && isBefore(event, before);
}

const createSection = (type: DaylightSectionType, startsAt: Date, endsAt: Date): DaylightSection => {
  const totalMinutes = (endsAt.getTime() - startsAt.getTime()) / 1000 / 60;
  return {
    type,
    startsAt,
    endsAt,
    totalMinutes,
  };
};

@Injectable({ providedIn: 'root' })
export class DaylightSectionsCalculatorService {
  #calculator = inject(CelestialCalculatorService);

  createSections(date: Date, location: Location): DaylightSections {
    const events = this.#calculator.createCelestialEvents(date, location);
    const sections: DaylightSection[] = [];
    this.#addDaylightSections(sections, events);

    return {
      events,
      sections,
    };
  }

  #addDaylightSections(sections: DaylightSection[], events: CelestialEvents): void {
    let momentPointer = events.startDate;

    if (events.sunUpAtStart) {
      if (events.sunset == undefined) {
        sections.push(createSection(DaylightSectionType.DAY, momentPointer, events.endDate));
        return;
      }

      sections.push(createSection(DaylightSectionType.DAY, momentPointer, events.sunset));
      momentPointer = events.sunset;
    }

    momentPointer = this.#addCivilTWilightSections(sections, events, momentPointer);

    if (momentPointer < events.endDate) {
      sections.push(createSection(DaylightSectionType.DAY, momentPointer, events.endDate));
    }
  }

  #addCivilTWilightSections(sections: DaylightSection[], events: CelestialEvents, momentPointer: Date): Date {
    const civilDawnEnd = events.civilDawnEnd ?? events.endDate;

    if (events.civilDuskEnd == undefined) {
      sections.push(createSection(DaylightSectionType.TWILIGHT, momentPointer, civilDawnEnd));
      return civilDawnEnd;
    }

    sections.push(createSection(DaylightSectionType.TWILIGHT, momentPointer, events.civilDuskEnd));
    momentPointer = events.civilDuskEnd;

    momentPointer = this.#addNauticalTWilightSections(sections, events, momentPointer);

    if (momentPointer < civilDawnEnd) {
      sections.push(createSection(DaylightSectionType.TWILIGHT, momentPointer, civilDawnEnd));
    }

    return civilDawnEnd;
  }

  #addNauticalTWilightSections(sections: DaylightSection[], events: CelestialEvents, momentPointer: Date): Date {
    const nauticalDawnEnd = events.nauticalDawnEnd ?? events.endDate;

    if (events.nauticalDuskEnd == undefined) {
      sections.push(createSection(DaylightSectionType.NAUTICAL_TWILIGHT, momentPointer, nauticalDawnEnd));
      return nauticalDawnEnd;
    }

    sections.push(createSection(DaylightSectionType.NAUTICAL_TWILIGHT, momentPointer, events.nauticalDuskEnd));
    momentPointer = events.nauticalDuskEnd;

    momentPointer = this.#addAstronomicalTWilightSections(sections, events, momentPointer);

    if (momentPointer < nauticalDawnEnd) {
      sections.push(createSection(DaylightSectionType.NAUTICAL_TWILIGHT, momentPointer, nauticalDawnEnd));
    }

    return nauticalDawnEnd;
  }

  #addAstronomicalTWilightSections(sections: DaylightSection[], events: CelestialEvents, momentPointer: Date): Date {
    const astronomicalDawnEnd = events.astronomicalDawnEnd ?? events.endDate;

    if (events.astronomicalDuskEnd == undefined) {
      sections.push(createSection(DaylightSectionType.ASTRONOMICAL_TWILIGHT, momentPointer, astronomicalDawnEnd));
      return astronomicalDawnEnd;
    }

    sections.push(createSection(DaylightSectionType.ASTRONOMICAL_TWILIGHT, momentPointer, events.astronomicalDuskEnd));
    momentPointer = events.astronomicalDuskEnd;

    momentPointer = this.#addNightSections(sections, events, momentPointer);

    if (momentPointer < astronomicalDawnEnd) {
      sections.push(createSection(DaylightSectionType.ASTRONOMICAL_TWILIGHT, momentPointer, astronomicalDawnEnd));
    }

    return astronomicalDawnEnd;
  }

  #addNightSections(sections: DaylightSection[], events: CelestialEvents, momentPointer: Date): Date {
    const nightEnd = events.nightEnd ?? events.endDate;

    if (events.moonupAtNightStart) {
      if (events.moonset == undefined || !happensBetween(events.moonset, momentPointer, nightEnd)) {
        sections.push(createSection(DaylightSectionType.MOON, momentPointer, nightEnd));
        return nightEnd;
      }

      sections.push(createSection(DaylightSectionType.MOON, momentPointer, events.moonset));
      momentPointer = events.moonset;
    }

    if (events.moonrise == undefined || !happensBetween(events.moonrise, momentPointer, nightEnd)) {
      sections.push(createSection(DaylightSectionType.NIGHT, momentPointer, nightEnd));
      return nightEnd;
    }

    sections.push(createSection(DaylightSectionType.NIGHT, momentPointer, events.moonrise));
    sections.push(createSection(DaylightSectionType.MOON, events.moonrise, nightEnd));
    return nightEnd;
  }
}
