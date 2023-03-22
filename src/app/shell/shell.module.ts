import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ShellComponent } from './shell.component';
import { ShellService } from './shell.service';
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
        loadChildren: () => import('../pages/info/info.module').then(m => m.InfoModule),
      },
      {
        path: 'year',
        loadChildren: () => import('../pages/year/year.module').then(m => m.YearModule),
        canActivate: [locationGuard]
      },
      {
        path: 'location',
        loadChildren: () => import('../pages//location/routes')
      },
    ]
  }
];

@NgModule({
  declarations: [
    ShellComponent,
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
    ShellComponent,
  ]
})
export class ShellModule { }
