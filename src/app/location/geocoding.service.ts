import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const NOMATIM_URL = 'https://nominatim.openstreetmap.org';

@Injectable({providedIn: 'root'})
export class GeocodingService {
    #httpClient = inject(HttpClient);
    
    public async search(query: string): Promise<SearchResult[]>
    {
        const results = await firstValueFrom(this.#httpClient.get<SearchResult[]>(`${NOMATIM_URL}/search?q=${query}&zoom=10&format=jsonv2`));
        return results.map(result => this.map(result));
    }

    public async reverse(lat: number, lng: number): Promise<SearchResult>
    {
        const result = await firstValueFrom(this.#httpClient.get<SearchResult>(`${NOMATIM_URL}/reverse?lat=${lat}&lon=${lng}&zoom=10&format=jsonv2`));
        return this.map(result);
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

