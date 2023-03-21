import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { LocationService } from './location.service';
import { Location } from './location.model';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  public form: UntypedFormGroup;
  public location$ = this.locationService.location$;
  public fetchingPosition = false;
  public hasLocation$ = this.locationService.hasLocation$;

  constructor(
    private readonly locationService: LocationService,
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

  public fetchCurrentLocation(): void
  {
    this.form.disable();
    this.locationService.fetchCurrentLocation().subscribe(
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
    this.locationService.fetchLocation(this.formLocation.name).subscribe(
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
