import { DOCUMENT } from "@angular/common";
import { Injectable, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from "@angular/service-worker";
import { EMPTY, Observable, fromEvent, shareReplay, take } from 'rxjs';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  readonly #swUpdate = inject(SwUpdate);
  readonly #document = inject(DOCUMENT);

  readonly #beforeInstallPrompt$ = this.#document.defaultView == null
    ? EMPTY
    : (fromEvent(this.#document.defaultView, 'beforeinstallprompt') as Observable<BeforeInstallPromptEvent>).pipe(take(1), shareReplay());

  readonly #canInstall = signal(false);
  readonly canInstall = this.#canInstall.asReadonly();

  readonly #window = this.#document.defaultView;
  #promptEvent: BeforeInstallPromptEvent | undefined = undefined;

  constructor() {
    this.#beforeInstallPrompt$.subscribe((evt) => {
      console.log('Application can be installed as PWA.');
      this.#promptEvent = evt;
      this.#canInstall.set(true);
    });

    this.#checkForUpdate();
  }

  #checkForUpdate(): void {
    if (!this.#swUpdate.isEnabled) {
      return;
    }

    this.#swUpdate.versionUpdates.pipe(
      takeUntilDestroyed(),
    ).subscribe((evt) => {
      switch (evt.type) {
        case 'NO_NEW_VERSION_DETECTED':
          console.log(`Running app version: ${evt.version.hash}`);
          break;
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          break;
      }
    });
  }

  public update(): void {
    if (this.#window !== null) {
      this.#window.location.reload();
    }
  }

  public async install(): Promise<void> {
    if (this.#promptEvent == undefined) {
      return;
    }

    await this.#promptEvent.prompt();
    const result = await this.#promptEvent.userChoice;

    if (result.outcome === 'accepted') {
      console.log('user accepted add to homescreen');
    } else {
      console.log('user dismissed the add to homescreen');
    }

    this.#canInstall.set(false);
  }
}
