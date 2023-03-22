import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ShellComponent } from './shell.component';
import { locationGuard } from '../pages/location/location.guard';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'year',
        pathMatch: 'full',
      },
      {
        path: 'info',
        loadChildren: () => import('../pages/info/routes'),
      },
      {
        path: 'year',
        loadChildren: () => import('../pages/year/routes'),
        canActivate: [locationGuard]
      },
      {
        path: 'location',
        loadChildren: () => import('../pages/location/routes')
      },
    ]
  }
];

@NgModule({
  declarations: [
    // ShellComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    // ShellComponent,
  ]
})
export class ShellModule { }
