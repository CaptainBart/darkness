import { Pipe, PipeTransform } from '@angular/core';
import { parseISO, format as formatLocal } from 'date-fns';
import { format as formatTZ, OptionsWithTZ, utcToZonedTime } from 'date-fns-tz';


@Pipe({name: 'dateFns'})
export class DateFnsPipe implements PipeTransform {
    public transform(value: Date, format: string = 'Pp', timezone: string = null): string {
        console.dir(value);
        if (timezone == null) {
            return formatLocal(value, format);
        }
        
        const zonedDate = utcToZonedTime(value.toISOString(), timezone);
        return formatTZ(zonedDate, format, {timeZone: timezone});
    }
}