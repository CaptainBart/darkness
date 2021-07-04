import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearComponent } from './year.component';
import { MonthComponent } from './month.component';

import { RouterModule, Routes } from '@angular/router';
import { DarknessModule } from '../../components/darkness/darkness.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: `${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
    pathMatch: 'full',
  },
  {
    path: ':year',
    component: YearComponent,
  },
  {
    path: ':year/:month',
    component: MonthComponent,
  }
];

@NgModule({
  declarations: [
    YearComponent,
    MonthComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DarknessModule,
  ]
})
export class YearModule { }
