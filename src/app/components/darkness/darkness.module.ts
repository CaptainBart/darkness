import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarknessYearComponent } from './darkness.component-year';
import { DarknessMonthComponent } from './darkness-month.component';
import { DarknessInfiniteComponent } from './darkness-infinite.component';

@NgModule({
  declarations: [
    DarknessYearComponent,
    DarknessMonthComponent,
    DarknessInfiniteComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DarknessYearComponent,
    DarknessMonthComponent,
    DarknessInfiniteComponent,
  ]
})
export class DarknessModule { }
