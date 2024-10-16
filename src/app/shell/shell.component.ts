import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
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
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShellComponent implements OnDestroy {
  readonly #shellService = inject(ShellService);
  readonly #pwa = inject(PwaService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #media = inject(MediaMatcher);

  readonly #mobileQueryListener = () => { this.#changeDetectorRef.detectChanges(); }
  readonly mobileQuery = this.#media.matchMedia('(max-width: 600px)');
  readonly canInstall = this.#pwa.canInstall;
  readonly canUpdate = this.#pwa.canUpdate;
  readonly title = this.#shellService.title;

  constructor() {
    this.mobileQuery.addEventListener("change", this.#mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("change", this.#mobileQueryListener);
  }

  previousClicked() {
    this.#shellService.previousClick();
  }

  nextClicked() {
    this.#shellService.nextClick();
  }

  async installApp(): Promise<void> {
    await this.#pwa.install();
  }

  updateApp() {
    this.#pwa.update();
  }
}
