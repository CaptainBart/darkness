import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

type HourCycle = 'h11' | 'h12' | 'h23' | 'h24';
const defaultFormatOptions: Intl.DateTimeFormatOptions | { hourCycle: HourCycle | undefined } = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };

@Pipe({ name: 'toLocaleTime', standalone: true })
export class ToLocaleTime implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private readonly locale: string) { }

  public transform(value: Date, timeZone: string): string {
    const opts: Intl.DateTimeFormatOptions = { ...defaultFormatOptions, timeZone };
    return value.toLocaleTimeString([this.locale], opts);
  }
}

@Pipe({ name: 'toLocaleDate', standalone: true })
export class ToLocaleDate implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private readonly locale: string) { }

  public transform(value: Date, timeZone: string): string {
    const opts: Intl.DateTimeFormatOptions = { ...defaultFormatOptions, timeZone };
    return value.toLocaleDateString([this.locale], opts);
  }
}

@Pipe({ name: 'toLocaleDateTime', standalone: true })
export class ToLocaleDateTime implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private readonly locale: string) { }

  public transform(value: Date, timeZone: string): string {
    const opts: Intl.DateTimeFormatOptions = { ...defaultFormatOptions, timeZone };
    return value.toLocaleString([this.locale], opts);
  }
}
