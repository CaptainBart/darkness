import { inject, InjectionToken, Signal } from "@angular/core";
import { Location } from "./location.model";
import { LocationService } from "./location.service";

export const LOCATION_TOKEN = new InjectionToken<Signal<Location|undefined>>('location', {
    factory: () => inject(LocationService).location
});