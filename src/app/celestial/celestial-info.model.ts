import * as SunCalc from 'suncalc';

export interface CelestialInfo {
  sunTimes: SunCalc.GetTimesResult;
  moonTimes: SunCalc.GetMoonTimes;
  timezone: string;

  noon: Date;
  sunUpAtNoon: boolean;
  civilTwilightAtNoon: boolean;
  nauticalTwilightAtNoon: boolean;
  astronomicalTwilightAtNoon: boolean;
  darkAtNoon: boolean;
  moonUpAtNoon: boolean;
}
