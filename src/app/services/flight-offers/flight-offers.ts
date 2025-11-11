import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class FlightOffers {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  searchFlightOffers(originLocationCode: string, destinationLocationCode: string, departureDate: string, adults: number): Observable<any> {
    return this.authService.getAccessToken().pipe(
      switchMap(token => {

        const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json');


        const params = new HttpParams()
          .set('originLocationCode', originLocationCode)
          .set('destinationLocationCode', destinationLocationCode)
          .set('departureDate', departureDate)
          .set('adults', adults.toString())
          .set('currencyCode', 'USD')
          .set('max', '5');

        const url = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
        return this.http.get(url, { headers, params });

      })
    );
  }
}
