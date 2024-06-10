import { Location } from "@app/location";
import * as SunCalc from 'suncalc';

export interface CelestialInfo {
  sunTimes: SunCalc.GetTimesResult;
  moonTimes: SunCalc.GetMoonTimes;

  noon: Date;
  sunUpAtNoon: boolean;
  civilTwilightAtNoon: boolean;
  nauticalTwilightAtNoon: boolean;
  astronomicalTwilightAtNoon: boolean;
  darkAtNoon: boolean;
  moonUpAtNoon: boolean;
}
