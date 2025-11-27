import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightOffers } from '../../services/flight-offers/flight-offers';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SummaryModal } from '../summary-modal/summary-modal';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private flightService: FlightOffers, private http: HttpClient, private router: Router, private dialog: MatDialog) { }

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
      this.http.get<any>('assets/mock/flightSearchData.json').subscribe(data => {
        this.originLocationCode = data.originLocationCode;
        this.destinationLocationCode = data.destinationLocationCode;
        this.departureDate = data.departureDate;
        this.adults = data.adults;
      });
    }
  }

  openSummaryModal() {
    this.dialog.open(SummaryModal, {
      width: '600px',
      height: 'auto'
    });
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
    const parsedData = storedData ? JSON.parse(storedData) : {};

    parsedData.selectedFlight = {
      selected: true,
      from: offer.itineraries[0]?.segments[0]?.departure?.iataCode,
      to: offer.itineraries[0]?.segments[0]?.arrival?.iataCode,
      name: offer.itineraries[0]?.segments[0]?.carrierCode + " " + offer.itineraries[0]?.segments[0]?.number,
      price: offer.price?.total + " " + offer.price?.currency
    };

    localStorage.setItem('travelSearchData', JSON.stringify(parsedData));
    console.log('✅ Flight saved to LocalStorage:', parsedData);

    console.log('Hotel selected:', parsedData.selectedHotel?.selected);
    console.log('Flight selected:', parsedData.selectedFlight?.selected);


    if (!parsedData.selectedHotel?.selected) {
      console.log('➡ Navigating to /hotels');
      this.router.navigate(['/hotels']);
    } else if (!parsedData.selectedFlight?.selected) {
      console.log('➡ Navigating to /flight-offers');
      this.router.navigate(['/flight-offers']);
    } else {
      console.log('➡ Navigating to /summary');
      this.openSummaryModal();
    }

  }

}