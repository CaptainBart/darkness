import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LocationService } from './location.service';
import { Location } from './location.model';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  public form: FormGroup;
  public location$ = this.locationService.location$;
  public fetchingPosition = false;

  constructor(
    private readonly locationService: LocationService,
    private readonly formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      'name': [''],
      'lat': [''],
      'lng': ['']
    });

    this.location$.pipe(
      take(1)
    ).subscribe(
      (location: Location) => this.formLocation = location
    );
  }

  public get formLocation(): Location
  {
    return this.form.value;
  }
  public set formLocation(value: Location)
  {
    this.form.setValue(value);
  }

  ngOnInit(): void {
  }

  public fetchPosition(): void
  {
    this.fetchingPosition = true;
    this.form.disable();
    this.locationService.fetchGpsLocation().subscribe(
      (position => {
        console.dir(position.coords);
        this.formLocation = {
          'name': 'Current position',
          'lat': position.coords.latitude,
          'lng': position.coords.longitude,
        };
        
        this.fetchingPosition = false;
        this.form.enable();
      }),
      () => {
        this.fetchingPosition = false;
        this.form.enable();
      }
    );
  }

  public storePosition(): void
  {
    this.locationService.changeLocation(this.formLocation);
    this.router.navigateByUrl('/');
  }
}
