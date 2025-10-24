import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class CitySearch {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private baseUrl = 'https://test.api.amadeus.com/v1';

  //şehir araması için 
  getCity(keyword: string): Observable<any> {
    return this.authService.ensureToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const params = new HttpParams().set("keyword", keyword).set("max", 5).set('include', 'AIRPORTS');

        return this.http.get(`${this.baseUrl}/reference-data/locations/cities`, {
          headers,
          params
        });
      })
    )
  }
}
