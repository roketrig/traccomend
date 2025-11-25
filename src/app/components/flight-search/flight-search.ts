import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightOffers } from '../../services/flight-offers/flight-offers';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, HttpClientModule],
  templateUrl: './flight-search.html',
  styleUrls: ['./flight-search.css']
})
export class FlightSearch implements OnInit {
  originLocationCode = '';
  destinationLocationCode = '';
  departureDate = '';
  adults = 1;

  flightOffers: any[] = [];
  isLoading = false;
  error = '';

  constructor(private flightService: FlightOffers, private http: HttpClient) { }

  ngOnInit() {
    const storedData = localStorage.getItem("travelSearchData");
    const parsedData = storedData ? JSON.parse(storedData) : null;

    if (parsedData) {
      const iataCode = parsedData.target_city_iata_code;
      const depiataCode = parsedData.departure_city_iata_code;
      const depDate = parsedData.departure_date;
      this.originLocationCode = iataCode;
      this.destinationLocationCode = depiataCode;
      this.departureDate = depDate;
    } else {
      // LocalStorage yoksa mock JSON'dan veri çek
      this.http.get<any>('assets/mock/flightSearchData.json').subscribe(data => {
        this.originLocationCode = data.originLocationCode;
        this.destinationLocationCode = data.destinationLocationCode;
        this.departureDate = data.departureDate;
        this.adults = data.adults;
      });
    }
  }

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
  selectFlight(offer: any) {
    const storedData = localStorage.getItem('travelSearchData');
    const parsedData = storedData ? JSON.parse(storedData) : null;

    parsedData.selectedFlight.from = offer.itineraries[0]?.segments[0]?.departure?.iataCode;
    parsedData.selectedFlight.to = offer.itineraries[0]?.segments[0]?.arrival?.iataCode;
    parsedData.selectedFlight.name = offer.itineraries[0]?.segments[0]?.carrierCode + " " + offer.itineraries[0]?.segments[0]?.number;
    parsedData.selectedFlight.price = offer.price?.total + " " + offer.price?.currency;
    parsedData.count = (parsedData.count || 0) + 1;
    localStorage.setItem('travelSearchData', JSON.stringify(parsedData));
    console.log('✅ Flight saved to LocalStorage:', parsedData);
  }
}