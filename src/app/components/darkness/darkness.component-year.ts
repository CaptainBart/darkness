import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DarknessService } from './darkness.service';

@Component({
  selector: 'app-darkness-year',
  templateUrl: './darkness-year.component.html',
  styleUrls: ['./darkness-year.component.scss']
})
export class DarknessYearComponent implements OnInit, OnChanges {
  @Input()
  public lat: number = 52.091222;
  @Input()
  public lng: number = 5.125379;
  @Input()
  public year: number = new Date().getFullYear();

  nightsSubject = new BehaviorSubject([]);
  night$ = this.nightsSubject.asObservable();

  constructor(private readonly darknessService: DarknessService) {
  }

  ngOnInit(): void {
    this.updateDarkness();
  }

  ngOnChanges(changes: SimpleChanges): void {
   this.updateDarkness();
  }

  private updateDarkness(): void {
    this.nightsSubject.next(this.darknessService.getDarknessForYear(this.year, this.lat, this.lng));
  }

}
