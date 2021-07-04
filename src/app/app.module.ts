import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DarknessModule } from './components/darkness/darkness.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./shell/shell.module').then(m => m.ShellModule) },
  // { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    DarknessModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
