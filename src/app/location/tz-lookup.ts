import * as tz_lookup_ from 'tz-lookup';
export function tz_lookup(lat: number, lng: number): string {
    return tz_lookup_(lat, lng);
} ;