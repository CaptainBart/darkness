import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

const defaultFormatOptions: Intl.DateTimeFormatOptions|{hourCycle: string} = {hour: '2-digit', minute: '2-digit', hourCycle: 'h23'};

@Pipe({name: 'toLocaleTime'})
export class ToLocaleTime implements PipeTransform {
    constructor(@Inject(LOCALE_ID) private readonly locale: string) {}
        
    public transform(value: Date, timeZone: string = null): string {
        const opts: Intl.DateTimeFormatOptions = {...defaultFormatOptions, timeZone};
        return value.toLocaleTimeString([this.locale], opts);
    }
}

@Pipe({name: 'toLocaleDate'})
export class ToLocaleDate implements PipeTransform {
    constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    public transform(value: Date, timeZone: string = null): string {
        const opts: Intl.DateTimeFormatOptions = {...defaultFormatOptions, timeZone};
        return value.toLocaleDateString([this.locale], opts);
    }
}

@Pipe({name: 'toLocaleDateTime'})
export class ToLocaleDateTime implements PipeTransform {
    constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    public transform(value: Date, timeZone: string = null): string {
        const opts: Intl.DateTimeFormatOptions = {...defaultFormatOptions, timeZone};
        return value.toLocaleString([this.locale], opts);
    }
}
