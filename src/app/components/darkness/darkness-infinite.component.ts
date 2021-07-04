import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  public lat: number = 52.02258929470043;
  @Input()
  public lng: number = 5.634036837524087;
  @Input()
  public year: number = new Date().getFullYear();
  @Input()
  public month: number = new Date().getMonth();

  public nightsSubject = new BehaviorSubject<DarknessSections[]>([]);
  public night$ = this.nightsSubject.asObservable();
  public SectionType = SectionType;

  constructor(private darknessService: DarknessService) {
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
    this.nightsSubject.next(this.darknessService.getInfiniteDarkness(this.year, this.month - 1, this.lat, this.lng));
  }

}
