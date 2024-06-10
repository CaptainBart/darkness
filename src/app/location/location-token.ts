import { inject, InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { Location } from "./location.model";
import { LocationService } from "./location.service";

export const LOCATION_TOKEN = new InjectionToken<Observable<Location|undefined>>('location', {
    factory: () => inject(LocationService).location$
});