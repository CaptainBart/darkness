import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShellService {
  #previousClicked = new Subject<void>();
  previousClicked$ = this.#previousClicked.asObservable();

  #nextClicked = new Subject<void>();
  nextClicked$ = this.#nextClicked.asObservable();

  #title = new BehaviorSubject('');
  title$ = this.#title.asObservable();

  previousClick(): void {
    this.#previousClicked.next();
  }

  nextClick(): void {
    this.#nextClicked.next();
  }

  changeTitle(newTitle: string): void {
    this.#title.next(newTitle);
  }
}
