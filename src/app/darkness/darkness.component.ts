import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { DarknessSections, SectionType } from './models/darkness-sections';
import { DarknessDataSource } from './darkness.data-source';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-darkness',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    SharedModule,
  ],
  templateUrl: './darkness.component.html',
  styleUrls: ['./darkness.component.scss']
})
export class DarknessComponent implements AfterViewInit {
  @Output()
  public dateChange = new EventEmitter<{date: Date, sections: DarknessSections}>();
  public SectionType = SectionType;
  public loading = true;

  datasource = new DarknessDataSource();
    
  @ViewChild(CdkVirtualScrollViewport)
  scroller!: CdkVirtualScrollViewport;

  public highlightRowIndex = 0;

  async onScrolledIndexChanged(index: number) {
    this.highlightRowIndex = index + 10;
    const date = this.datasource.getKeyForIndex(this.highlightRowIndex);
    const sections = await firstValueFrom(this.datasource.fetchItem(date));
    this.dateChange.emit({date, sections});
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scroller.scrollToIndex(this.datasource.getInitialIndex(), 'auto');
      this.loading = false;
    },0);
  }
}
