import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { SectionType } from './models/darkness-sections';
import { DarknessDataSource } from './darkness.data-source';

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
  public dateChange = new EventEmitter<Date>();
  public SectionType = SectionType;
  public loading = true;

  datasource = new DarknessDataSource();
    
  @ViewChild(CdkVirtualScrollViewport)
  scroller!: CdkVirtualScrollViewport;

  onScrolledIndexChanged(index: number) {
    const date = this.datasource.getKeyForIndex(index);
    this.dateChange.emit(date);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scroller.scrollToIndex(this.datasource.getInitialIndex(), 'auto');
      this.loading = false;
    },0);
  }
}
