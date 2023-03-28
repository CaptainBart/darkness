import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShellService {
    private previousClickedSubject = new Subject<void>();
    public previousClicked$ = this.previousClickedSubject.asObservable();

    private nextClickedSubject = new Subject<void>();
    public nextClicked$ = this.nextClickedSubject.asObservable();

    private titleSubject = new BehaviorSubject('');
    public title$ = this.titleSubject.asObservable();

    constructor() { }
    
    public previousClick(): void {
        this.previousClickedSubject.next();
    }

    public nextClick(): void {
        this.nextClickedSubject.next();
    }

    public changeTitle(newTitle: string): void {
        this.titleSubject.next(newTitle);
    }
}