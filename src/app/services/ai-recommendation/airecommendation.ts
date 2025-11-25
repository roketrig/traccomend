
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiRecommendationService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private http: HttpClient) {}

  getRecommendations(country: string, interests: string): Observable<any> {
    const prompt = `Bir gezgin için ${country} ülkesinde ${interests} ilgi alanlarına uygun 5 şehir önerisi yap.`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.googleApiKey}`
    });

    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
