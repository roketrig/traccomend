import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class TravelRecommendations {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private baseUrl = 'https://test.api.amadeus.com/v1';

  getRecommendations(cityCode: string, countryCode: string): Observable<any> {
    return this.authService.ensureToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const params = new HttpParams()
          .set('cityCode', cityCode)
          .set('countryCode', countryCode);

        // Bu endpoint'i Amadeus API'ye göre güncellemen gerekebilir
        return this.http.get(`${this.baseUrl}/reference-data/recommended-locations`, {
          headers,
          params
        });
      })
    );
  }

  // Flight offers için method
  getFlightOffers(origin: string, destination: string, departureDate: string): Observable<any> {
    return this.authService.ensureToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const params = new HttpParams()
          .set('originLocationCode', origin)
          .set('destinationLocationCode', destination)
          .set('departureDate', departureDate)
          .set('adults', '1')
          .set('max', '5');

        return this.http.get(`${this.baseUrl}/shopping/flight-offers`, {
          headers,
          params
        });
      })
    );
  }
}