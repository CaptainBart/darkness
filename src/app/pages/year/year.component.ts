import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ShellService } from 'src/app/shell/shell.service';
import { LocationService } from '../location/location.service';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  location$ = this.locationService.location$;

  year$ = this.route.params.pipe(
    map(params => +params['year']),
    tap(year => console.dir(year))
  );

  constructor(private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly locationService: LocationService,
              private readonly shellService: ShellService) {
    this.shellService.previousClicked$.pipe(
      takeUntil(this.destroy$),
      withLatestFrom(this.year$, (_, year) => year)
    )
    .subscribe((year) => {
      this.router.navigate(['year', year - 1]);
    });

    this.shellService.nextClicked$.pipe(
      takeUntil(this.destroy$),
      withLatestFrom(this.year$, (_, year) => year)
    )
    .subscribe((year) => {
      this.router.navigate(['year', year + 1]);
    });

    this.year$.pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((year) => {
      this.shellService.changeTitle(year.toString());
    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
