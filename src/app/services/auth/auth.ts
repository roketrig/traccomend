import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, of } from 'rxjs';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  // Environment'dan alıyoruz
  private clientId = environment.amadeus.clientId;
  private clientSecret = environment.amadeus.clientSecret;
  private tokenUrl = environment.amadeus.tokenUrl;

  private readonly TOKEN_KEY = 'travel_token';
  private readonly TOKEN_EXPIRY_KEY = 'travel_token_expiry';

  token = signal<string | null>(this.getStoredToken());

  getAccessToken(): Observable<string> {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret);

    console.log('Getting token from:', this.tokenUrl);
    console.log('Client ID:', this.clientId);

    return this.http.post<any>(this.tokenUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(response => {
        console.log('Token received, expires in:', response.expires_in);
        this.setToken(response.access_token, response.expires_in);
      }),
      map(res => res.access_token)
    );
  }

  ensureToken(): Observable<string> {
    const currentToken = this.token();
    
    if (currentToken && this.isTokenValid()) {
      console.log('Using existing token');
      return of(currentToken);
    } else {
      console.log('Getting new token');
      return this.getAccessToken();
    }
  }

  getToken(): string | null {
    return this.token();
  }

  setToken(token: string, expiresIn: number = 1800): void {
    const expiryTime = Date.now() + (expiresIn * 1000);
    
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    
    this.token.set(token);
    console.log('Token saved until:', new Date(expiryTime).toLocaleTimeString());
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.token.set(null);
  }

  isTokenValid(): boolean {
    const token = this.getStoredToken();
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) return false;
    
    const isExpiringSoon = Date.now() >= (parseInt(expiry) - 300000);
    
    if (isExpiringSoon) {
      return false;
    }
    
    return Date.now() < parseInt(expiry);
  }

  private getStoredToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) return null;
    
    if (Date.now() >= parseInt(expiry)) {
      this.clearToken();
      return null;
    }
    
    return token;
  }
}