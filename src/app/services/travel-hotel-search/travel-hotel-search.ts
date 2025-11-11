import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class TravelHotelSearch {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private hotelListUrl = 'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city';

  searchHotelsByCity(cityCode: string): Observable<any> {
    return this.authService.getAccessToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = new HttpParams()
          .set('cityCode', cityCode)
          .set('radius', '5') 
          .set('radiusUnit', 'KM');

        return this.http.get(this.hotelListUrl, { headers, params });
      })
    );
  }
}
