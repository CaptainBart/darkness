import { DOCUMENT } from "@angular/common";
import { ApplicationRef, Injectable, inject } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { BehaviorSubject, Observable, first, from, switchMap } from 'rxjs';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

@Injectable({
    providedIn: 'root'
  })
export class PwaService {
    private swUpdate = inject(SwUpdate);
    private applicationRef = inject(ApplicationRef);
    private document = inject(DOCUMENT);
    private window = this.document.defaultView;
    private promptEvent: BeforeInstallPromptEvent|undefined = undefined;
    private canInstall = new BehaviorSubject(false);
    canInstall$ = this.canInstall.asObservable();

    constructor() {
        // this.window.addEventListener('beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
        //     this.promptEvent = event;
        //     this.canInstall.next(true);
        // });
    }

    public checkForUpdates(): Observable<boolean>
    {
        return this.applicationRef.isStable.pipe(
            switchMap(() => from(this.swUpdate.checkForUpdate()))
        );
    }

    public update(): void
    {
        // this.window.location.reload();
    }

    public install(): void
    {
        if(this.promptEvent == undefined) {
            return;
        }
        
        this.promptEvent.prompt();
        this.promptEvent.userChoice.then((result) => {
            if (result.outcome === 'accepted') {
                console.log('user accepted add to homescreen');
            } else {
                console.log('user dismissed the add to homescreen');
            }
            
            this.canInstall.next(false);
        });
    }
}