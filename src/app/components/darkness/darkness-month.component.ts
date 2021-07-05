import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Darkness } from './darkness';
import { DarknessService } from './darkness.service';

@Component({
  selector: 'app-darkness-month',
  templateUrl: './darkness-month.component.html',
  styleUrls: ['./darkness-month.component.scss']
})
export class DarknessMonthComponent implements OnInit {
  @Input()
  public lat: number = 52.091222;
  @Input()
  public lng: number = 5.125379;
  @Input()
  public year: number = new Date().getFullYear();
  @Input()
  public month: number = new Date().getMonth();

  nightsSubject = new BehaviorSubject([]);
  night$ = this.nightsSubject.asObservable();

  constructor(private readonly darknessService: DarknessService) {
  }

  ngOnInit(): void {
    this.updateDarkness();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateDarkness();
  }

  private updateDarkness(): void {
    this.nightsSubject.next(this.darknessService.getDarknessForMonth(this.year, this.month - 1, this.lat, this.lng));
  }

}
