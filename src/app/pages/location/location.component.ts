import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import { LocationService, LocationLookupService, Location } from '@app/location';

const INITIAL_LOCATION: Location = {
  name: 'Roque de los Muchachos',
  lat: 28.764035,
  lng: -17.894234,
  timezone: 'Atlantic/Canary'
};


@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}},
  ],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {
  public form: UntypedFormGroup;
  public location$ = this.locationService.location$;
  public fetchingPosition = false;
  public hasLocation$ = this.locationService.hasLocation$;

  constructor(
    private readonly locationService: LocationService,
    private readonly lookupService: LocationLookupService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {
    this.form = this.formBuilder.group({
      'name': ['', Validators.required],
      'lat': ['', Validators.required],
      'lng': ['', Validators.required],
      'timezone': ['', Validators.required],
    });

    this.location$.pipe(
      take(1)
    ).subscribe(
      (location) => this.formLocation = location ?? INITIAL_LOCATION
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

  public fetchCurrentLocation(): void
  {
    this.form.disable();
    this.lookupService.fetchCurrentLocation().subscribe(
      (location => {
        console.dir(location);
        this.formLocation = location;
        this.form.enable();
      }),
      () => {
        this.form.enable();
      }
    );
  }

  public fetchLocationByName(): void
  {
    this.form.disable();
    this.lookupService.fetchLocation(this.formLocation.name).subscribe(
      (location => {
        if(location) {
          this.formLocation = location;
        }  else {
          this.snackBar.open('Location not found.', '');
        }    
        this.form.enable();
      }),
      () => {
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
