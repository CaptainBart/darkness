import { CelestialEvents } from "./celestial-events.model";

export interface DaylightSections {
  sections: DaylightSection[];
  events: CelestialEvents;
}

export interface DaylightSection {
  type: DaylightSectionType;
  startsAt: Date;
  endsAt: Date;
  totalMinutes: number;
};

export enum DaylightSectionType {
  DAY = 1,
  TWILIGHT = 2,
  NAUTICAL_TWILIGHT = 3,
  ASTRONOMICAL_TWILIGHT = 4,
  NIGHT = 5,
  MOON = 6,
}
