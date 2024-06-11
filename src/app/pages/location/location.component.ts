import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
  ],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {
  readonly #locationService = inject(LocationService);
  readonly #lookupService = inject(LocationLookupService);
  readonly #formBuilder = inject(UntypedFormBuilder);
  readonly #snackBar = inject(MatSnackBar);
  readonly #router = inject(Router);

  readonly form = this.#formBuilder.group({
    'name': ['', Validators.required],
    'lat': ['', Validators.required],
    'lng': ['', Validators.required],
    'timezone': ['', Validators.required],
  });

  readonly hasLocation = this.#locationService.hasLocation;

  constructor() {
    effect(() => {
      const location = this.#locationService.location();
      this.form.setValue(location ?? INITIAL_LOCATION);
    });
  }

  async fetchCurrentLocation(): Promise<void> {
    this.form.disable();
    try {
      const location = await this.#lookupService.fetchCurrentLocation();
      console.dir(location);
      this.form.setValue(location);
    } finally {
      this.form.enable();
    }
  }

  async fetchLocationByName(): Promise<void> {
    this.form.disable();
    try {
      console.dir(this.form.value);
      const location = await this.#lookupService.fetchLocation(this.form.value.name);

      if (!location) {
        this.#snackBar.open('Location not found.', '');
        return;
      }

      this.form.setValue(location);
    } finally {
      this.form.enable();
    }
  }

  storePosition(): void {
    this.#locationService.changeLocation(this.form.value);
    this.#router.navigateByUrl('/');
  }
}
