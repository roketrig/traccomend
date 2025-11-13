import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface City {
  city_name: string;
  city_iata_code: string;
  country_name: string;
  country_code: string;
}

@Injectable({ providedIn: 'root' })
export class CityService {
  constructor(private http: HttpClient) {}

  getCities(): Observable<City[]> {
    return this.http.get<City[]>('data/popular_cities.json');
  }
}