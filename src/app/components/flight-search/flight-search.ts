import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ngModel için gerekli
import { FlightOffers } from '../../services/flight-offers/flight-offers';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-search.html'
})
export class FlightSearch {
  // Form alanları
  originLocationCode = '';
  destinationLocationCode = '';
  departureDate = '';
  adults = 1;

  // API sonuçları
  flightOffers: any[] = [];
  isLoading = false;
  error = '';

  constructor(private flightService: FlightOffers) {}

  searchFlights() {
    this.isLoading = true;
    this.error = '';
    this.flightOffers = [];

    this.flightService.searchFlightOffers(
      this.originLocationCode,
      this.destinationLocationCode,
      this.departureDate,
      this.adults
    ).subscribe({
      next: (res: any) => {
        console.log('Flight API response:', res);
        this.flightOffers = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.error = err.error?.errors?.[0]?.detail || 'Something went wrong';
        this.isLoading = false;
      }
    });
  }
}