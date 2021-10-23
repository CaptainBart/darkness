import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DarknessSections, SectionType } from './darkness-sections';
import { DarknessService } from './darkness.service';

@Component({
  selector: 'app-darkness-infinite',
  templateUrl: './darkness-infinite.component.html',
  styleUrls: ['./darkness-infinite.component.scss']
})
export class DarknessInfiniteComponent implements OnInit {
  @Input()
  public lat: number = 28.764035;
  @Input()
  public lng: number = -17.894234;
  @Input()
  public year: number = new Date().getFullYear();
  @Input()
  public month: number = new Date().getMonth();
  @Input()
  public timezone: string = 'Atlantic/Canary';

  public nightsSubject = new BehaviorSubject<DarknessSections[]>([]);
  public night$ = this.nightsSubject.asObservable();
  public SectionType = SectionType;

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
    this.nightsSubject.next(this.darknessService.getInfiniteDarknessForMonth(this.year, this.month - 1, {lat: this.lat, lng: this.lng}));
  }

}
