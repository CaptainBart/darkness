import { CelestialInfo } from "./celestial-info.model";

export interface CelestialEvents {
  // todayEvents: CelestialInfo;
  // tomorrowEvents: CelestialInfo;

  startDate: Date;
  endDate: Date;
  totalMinutesBetweenNoons: number;

  sunUpAtStart: boolean;
  civilTwilightAtStart: boolean;
  nauticalTwilightAtStart: boolean;
  astronomicalTwilightAtStart: boolean;
  nightAtStart: boolean;
  moonUpAtStart: boolean;

  sunset: Date | undefined;
  civilDuskStart: Date | undefined;
  civilDuskEnd: Date | undefined;
  nauticalDuskStart: Date | undefined;
  nauticalDuskEnd: Date | undefined;
  astronomicalDuskStart: Date | undefined;
  astronomicalDuskEnd: Date | undefined;
  nightStart: Date | undefined;
  nightEnd: Date | undefined;
  astronomicalDawnStart: Date | undefined;
  astronomicalDawnEnd: Date | undefined;
  nauticalDawnStart: Date | undefined;
  nauticalDawnEnd: Date | undefined;
  civilDawnStart: Date | undefined;
  civilDawnEnd: Date | undefined;
  sunrise: Date | undefined;
  moonrise: Date | undefined;
  moonset: Date | undefined;
  moonupAtNightStart: boolean;
  moonUpAtNightEnd: boolean;
}
