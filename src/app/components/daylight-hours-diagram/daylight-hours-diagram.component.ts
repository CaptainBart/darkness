import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, input, model, signal, viewChild } from '@angular/core';
import { DaylightRowComponent } from '@app/components/daylight-row/daylight-row.component';
import { addDays, addYears, differenceInDays } from 'date-fns';

@Component({
  selector: 'app-daylight-hours-diagram',
  standalone: true,
  imports: [
    DaylightRowComponent,
    ScrollingModule,
    CommonModule,
  ],
  templateUrl: './daylight-hours-diagram.component.html',
  styleUrl: './daylight-hours-diagram.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaylightHoursDiagramComponent implements AfterViewInit {
  itemSize = 16;
  scroller = viewChild.required(CdkVirtualScrollViewport);
  loading = signal(true);
  date = model(new Date());
  minDate = input(addYears(new Date(), -10));
  maxDate = input(addYears(new Date(), 10));

  numberOfDays = computed(() => differenceInDays(this.maxDate(), this.minDate()));
  days = computed(() => Array.from({ length: this.numberOfDays() }).map((_, i) => addDays(this.minDate(), i)));

  viewportVisibleItems = computed(() => Math.floor(this.scroller().getViewportSize() / this.itemSize));
  currentItemIndexFromTop = computed(() => Math.floor(this.viewportVisibleItems() * 0.25));
  currentIndex = computed(() => differenceInDays(this.date(), this.minDate()));

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.dir(this.date());
      this.scroller().scrollToIndex(this.currentIndex() - this.currentItemIndexFromTop(), 'auto');
      this.loading.update(() => false);
    }, 10);
  }

  onScrolledIndexChanged(index: number) {
    if (this.loading()) {
      return;
    }
    this.date.set(addDays(this.minDate(), index + this.currentItemIndexFromTop()));
  }
}
