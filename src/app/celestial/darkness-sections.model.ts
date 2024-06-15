import { CelestialEvents } from "./celestial-events.model";

export interface DarknessSections {
  sections: Section[];
  events: CelestialEvents;
}

export interface Section {
  type: SectionType;
  startsAt: Date;
  endsAt: Date;
  totalMinutes: number;
};

export enum SectionType {
  DAY = 1,
  TWILIGHT = 2,
  NAUTICAL_TWILIGHT = 3,
  ASTRONOMICAL_TWILIGHT = 4,
  NIGHT = 5,
  MOON = 6,
}
