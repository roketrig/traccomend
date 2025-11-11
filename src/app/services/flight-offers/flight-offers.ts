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

searchFlightStatus(carrierCode: string, flightNumber: string, departureDate: string): Observable<any> {
  return this.authService.getAccessToken().pipe(
    switchMap(token => {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams()
        .set('carrierCode', carrierCode)
        .set('flightNumber', flightNumber)
        .set('scheduledDepartureDate', departureDate);


        const url = 'https://test.api.amadeus.com/v2/schedule/flights';
        return this.http.get(url, { headers, params });

    })
  );
}
}
