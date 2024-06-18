import { Injectable, effect, inject } from "@angular/core";
import { DaylightSectionsCalculatorService } from "@app/celestial/daylight-sections-calculator.service";
import { DaylightSections } from "@app/celestial/daylight-sections.model";
import { LocationService } from "@app/location";
import { createCache } from "./create-cache";

@Injectable({ providedIn: 'root' })
export class DaylightService {
  #locationService = inject(LocationService);
  #calculator = inject(DaylightSectionsCalculatorService);
  #cache = createCache<Date, DaylightSections>();

  constructor() {
    effect(() => {
      this.#locationService.location();
      this.#cache.clear();
    });
  }

  createSections(date: Date): DaylightSections {
    const location = this.#locationService.location();
    if (!location) {
      throw new Error('Cannot get daylight sections. No location found.');
    }

    return this.#cache.getOrCreate(date, () =>
      this.#calculator.createSections(date, location),
    );
  }
}
