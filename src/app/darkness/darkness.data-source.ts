import { addDays, differenceInDays } from 'date-fns'
import { VirtualInfiniteScrollDataSource } from "@app/shared";
import { inject } from '@angular/core';
import { DarknessService } from './darkness.service';
import { DarknessSections } from './models/darkness-sections';
import { Observable } from 'rxjs';

const totalNumberOfDays = 100 * 365;
const loadThreshold = 90;
export class DarknessDataSource extends VirtualInfiniteScrollDataSource<Date, DarknessSections> {
    #service: DarknessService;

    constructor(
        startDate = new Date(),
    ) {
        super(startDate, totalNumberOfDays, loadThreshold, loadThreshold);
        this.#service = inject(DarknessService);
        this.loadItems({start: this.getInitialIndex() - loadThreshold, end: this.getInitialIndex() + loadThreshold});
    }

    public getInitialIndex() {
        return totalNumberOfDays / 2;
    }
    
    public getIndexForKey(date: Date): number {
        return this.getInitialIndex() + differenceInDays(date, this.initialKey);
    }

    public getKeyForIndex(index: number): Date {
        return addDays(this.initialKey, index - this.getInitialIndex());
    }
    
    public fetchItem(key: Date): Observable<DarknessSections> {
        return this.#service.getDarknessForDay(key);
    }
}
