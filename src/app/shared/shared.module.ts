import { NgModule } from '@angular/core';
import { ToLocaleTime, ToLocaleDate, ToLocaleDateTime } from './date-locale.pipe';

@NgModule({
  declarations: [
    ToLocaleTime,
    ToLocaleDate,
    ToLocaleDateTime,
  ],
  imports: [
  ],
  exports: [
    ToLocaleTime,
    ToLocaleDate,
    ToLocaleDateTime,
  ],
  providers: [
  ]
})
export class SharedModule { }
