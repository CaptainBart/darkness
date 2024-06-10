import {MediaMatcher} from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { PwaService } from '@app/shared/pwa.service';
import { ShellService } from '@app/shared/shell.service';

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
  readonly #shellService = inject(ShellService);
  readonly #pwa = inject(PwaService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #media = inject(MediaMatcher);
  readonly #mobileQueryListener = () => this.#changeDetectorRef.detectChanges();
  readonly mobileQuery = this.#media.matchMedia('(max-width: 600px)');
  readonly canInstall$ = this.#pwa.canInstall$;
  readonly hasUpdate$ = this.#pwa.checkForUpdates();
  readonly title$ = this.#shellService.title$;

  constructor() {
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener("change", this.#mobileQueryListener);
    } else {
      this.mobileQuery.addListener(this.#mobileQueryListener);
    }
  }

  ngOnDestroy(): void {
    if (this.mobileQuery.removeEventListener) {
      this.mobileQuery.removeEventListener("change", this.#mobileQueryListener);
    } else {
      this.mobileQuery.removeListener(this.#mobileQueryListener);
    }
    
  }

  previousClicked() {
    this.#shellService.previousClick();
  }

  nextClicked() {
    this.#shellService.nextClick();
  }

  installApp() {
    this.#pwa.install();
  }

  updateApp() {
    this.#pwa.update();
  }
}
