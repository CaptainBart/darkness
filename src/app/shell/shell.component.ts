import {MediaMatcher} from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ShellService } from './shell.service';
import { PwaService } from '@app/shared/pwa-service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnDestroy {
  private pwa: PwaService = inject(PwaService);
  mobileQuery: MediaQueryList;

  canInstall$ = this.pwa.canInstall$;
  hasUpdate$ = this.pwa.checkForUpdates();
  title$ = this.shellService.title$;

  private _mobileQueryListener: () => void;

  constructor(private readonly shellService: ShellService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener("change", this._mobileQueryListener);
    } else {
      this.mobileQuery.addListener(this._mobileQueryListener);
    }
  }

  ngOnDestroy(): void {
    if (this.mobileQuery.removeEventListener) {
      this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
    } else {
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }
    
  }

  previousClicked() {
    this.shellService.previousClick();
  }

  nextClicked() {
    this.shellService.nextClick();
  }

  installApp() {
    this.pwa.install();
  }

  updateApp() {
    this.pwa.update();
  }
}
