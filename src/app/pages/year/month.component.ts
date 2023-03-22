import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { DarknessModule } from 'src/app/components/darkness/darkness.module';
import { ShellService } from 'src/app/shell/shell.service';
import { LocationService } from '../location/location.service';

@Component({
  standalone: true,
  imports:[
    CommonModule,
    DarknessModule,
  ],
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  location$ = this.locationService.location$;
  
  year$ = this.route.params.pipe(
    map(params => +params['year'])
  );

  month$ = this.route.params.pipe(
    map(params => +params['month'])
  );

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly locationService: LocationService,
    private readonly shellService: ShellService) {
    this.shellService.previousClicked$.pipe(
      takeUntil(this.destroy$),
      withLatestFrom(this.year$, (_, year) => year),
      withLatestFrom(this.month$)
    )
    .subscribe(([year, month]) => {
      this.router.navigate(['year', month == 1 ? year - 1 : year, month == 1 ? 12 : month - 1]);
    });

    this.shellService.nextClicked$.pipe(
      takeUntil(this.destroy$),
      withLatestFrom(this.year$, (_, year) => year),
      withLatestFrom(this.month$)
    )
    .subscribe(([year, month]) => {
      this.router.navigate(['year', month == 12 ? year + 1 : year, month == 12 ? 1 : month + 1]);
    });

    combineLatest([this.year$, this.month$]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([year, month]) => {

      this.shellService.changeTitle(`${month}/${year}`);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
