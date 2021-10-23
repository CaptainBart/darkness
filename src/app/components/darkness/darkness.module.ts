import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarknessInfiniteComponent } from './darkness-infinite.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DarknessInfiniteComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    DarknessInfiniteComponent,
  ]
})
export class DarknessModule { }
