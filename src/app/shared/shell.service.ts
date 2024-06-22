import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShellService {
  #title = signal('');
  title = this.#title.asReadonly();

  #previousClicked = new Subject<void>();
  previousClicked$ = this.#previousClicked.asObservable();

  #nextClicked = new Subject<void>();
  nextClicked$ = this.#nextClicked.asObservable();

  previousClick(): void {
    this.#previousClicked.next();
  }

  nextClick(): void {
    this.#nextClicked.next();
  }

  changeTitle(newTitle: string): void {
    this.#title.set(newTitle);
  }
}
