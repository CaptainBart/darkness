import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const NOMATIM_URL = 'https://nominatim.openstreetmap.org';

@Injectable({providedIn: 'root'})
export class GeocodingService {
    public constructor(private readonly httpClient: HttpClient) {

    }

    public search(query: string): Observable<SearchResult[]>
    {
        return this.httpClient.get<SearchResult[]>(`${NOMATIM_URL}/search?q=${query}&zoom=10&format=jsonv2`).pipe(
            map(results => results.map(result => this.map(result)))
        );
    }

    public reverse(lat: number, lng: number): Observable<SearchResult>
    {
        return this.httpClient.get<SearchResult>(`${NOMATIM_URL}/reverse?lat=${lat}&lon=${lng}&zoom=10&format=jsonv2`).pipe(
            map(result => this.map(result))
        );
    }

    private map(result: SearchResult): SearchResult
    {
        return {...result, ...{lng: result.lon}};
    }
}

export interface SearchResult
{
    place_id: string;
    license: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    lng: string;
    display_name: string;
    category: string;
    place_rank: number;
    type: string;
    importance: number;
    icon: string;
    address: {
        city: string;
        state_district: string;
        state: string;
        postcode: string;
        country: string;
        country_code: string;
    }
    
}

