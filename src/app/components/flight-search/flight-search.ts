import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightOffers } from '../../services/flight-offers/flight-offers';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-search.html'
})
export class FlightSearch {
  flightOffers: any[] = [];
  isLoading = true;
  error = '';

  constructor(private flightService: FlightOffers) {
    this.flightService.searchFlightStatus('TP', '487', '2023-08-01').subscribe({
      next: (res: any) => {
        console.log('Flight API response:', res);
        this.flightOffers = res.data || [];
        this.isLoading = false;
      },
error: (err: any) => {
  console.error('Flight search error:', err);
  console.error('Error details:', err.error);
  console.error('Error array:', err.error?.errors);
  if (err.error?.errors?.length) {
    err.error.errors.forEach((e: any, index: number) => {
      console.error(`Error ${index + 1}:`);
      console.error(`  Code: ${e.code}`);
      console.error(`  Title: ${e.title}`);
      console.error(`  Detail: ${e.detail}`);
      console.error(`  Source: ${JSON.stringify(e.source)}`);
    });
  }
  this.error = err.message || 'An error occurred while searching for flights';
  this.isLoading = false;
}
    });
  }
}