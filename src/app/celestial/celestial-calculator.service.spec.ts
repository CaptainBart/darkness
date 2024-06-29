
import * as SunCalc from 'suncalc';
import { CelestialCalculatorService } from './celestial-calculator.service';

describe('CelestialCalculatorService', () => {
  it('should create correct info', () => {
    const lat = 69.6516345;
    const lng = 18.9558585;


    const yesterday = new Date(Date.UTC(2024, 3, 9));
    const today = new Date(Date.UTC(2024, 3, 10));
    const tomorrow = new Date(Date.UTC(2024, 3, 11));

    const target = new CelestialCalculatorService();
    const events = target.createCelestialEvents(today, { lat, lng, timezone: 'ams', 'name': '' });

    const sunYesterday = SunCalc.getTimes(yesterday, lat, lng);
    const sunToday = SunCalc.getTimes(today, lat, lng);
    const sunTomorrow = SunCalc.getTimes(tomorrow, lat, lng);


    // const sunYesterday = SunCalc.getTimes(yesterday, lat, lng);
    // const sunToday = SunCalc.getTimes(today, lat, lng);
    // const sunTomorrow = SunCalc.getTimes(tomorrow, lat, lng);

  });

});
