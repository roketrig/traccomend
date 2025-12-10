import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlightOffers } from '../../services/flight-offers/flight-offers';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SummaryModal } from '../summary-modal/summary-modal';
import { MatDialog } from '@angular/material/dialog';
import { TripStateService } from '../../global-state/trip-state.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { City, CityService } from '../../services/city-search/cities';


@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, HttpClientModule, MatAutocompleteModule, ReactiveFormsModule],
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
  showContinueButton = false;

  departureCityControl = new FormControl<string | City | null>(null);
  destinationCityControl = new FormControl<string | City | null>(null);
  cities: City[] = [];
  filteredDepartureCities!: Observable<City[]>;
  filteredDestinationCities!: Observable<City[]>;

  constructor(private flightService: FlightOffers, private cityService: CityService, private http: HttpClient, private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private tripState: TripStateService) { }

  
ngOnInit() {
    // 1) Query paramlar / continue butonu
    this.route.queryParams.subscribe(params => {
      const storedData = localStorage.getItem('travelSearchData');
      const parsedData = storedData ? JSON.parse(storedData) : null;

      const fromParam = params['from'];
      const hasStoredHotel = !!(parsedData && (parsedData.selectedHotel?.selected === true || parsedData.selectedHotel?.passed === true));
      const hasStoredSearch = !!(parsedData && (parsedData.departure_date || parsedData.target_city || parsedData.target_city_iata_code));

      if (fromParam === 'result' || fromParam === 'hotels' || hasStoredHotel || hasStoredSearch) {
        this.showContinueButton = true;
      }
    });

    // 2) LocalStorage’dan başlangıç değerlerini oku (IATA + tarih)
    const storedData = localStorage.getItem('travelSearchData');
    const parsedData = storedData ? JSON.parse(storedData) : null;

    if (parsedData) {
      const originIata = (parsedData.departure_city_iata_code || '').toUpperCase();   // origin = departure
      const destinationIata = (parsedData.target_city_iata_code || '').toUpperCase(); // destination = target
      const depDate = parsedData.departure_date || '';

      this.originLocationCode = originIata;
      this.destinationLocationCode = destinationIata;
      this.departureDate = depDate;

      // FormControl’lere şimdilik string fallback set ediyoruz (şehirler henüz gelmeden)
      if (originIata) this.departureCityControl.setValue(originIata, { emitEvent: false });
      if (destinationIata) this.destinationCityControl.setValue(destinationIata, { emitEvent: false });
    } else {
      // Mock veriyi yükle (ilk girişte)
      this.http.get<any>('assets/mock/flightSearchData.json').subscribe(data => {
        this.originLocationCode = (data.originLocationCode || '').toUpperCase();
        this.destinationLocationCode = (data.destinationLocationCode || '').toUpperCase();
        this.departureDate = data.departureDate;
        this.adults = data.adults;

        if (this.originLocationCode) this.departureCityControl.setValue(this.originLocationCode, { emitEvent: false });
        if (this.destinationLocationCode) this.destinationCityControl.setValue(this.destinationLocationCode, { emitEvent: false });
      });
    }

    // 3) Şehirleri yükle ve filtreleri kur
    this.cityService.getCities().subscribe(data => {
      this.cities = data;

      // --- Filtre akışları ---
      this.filteredDepartureCities = this.departureCityControl.valueChanges.pipe(
        startWith(this.departureCityControl.value),
        map(value => typeof value === 'string' ? value.trim().toLowerCase() : (value?.city_name || '').toLowerCase()),
        map(keyword => this.cities.filter(city => city.city_name.toLowerCase().includes(keyword)))
      );

      this.filteredDestinationCities = this.destinationCityControl.valueChanges.pipe(
        startWith(this.destinationCityControl.value),
        map(value => typeof value === 'string' ? value.trim().toLowerCase() : (value?.city_name || '').toLowerCase()),
        map(keyword => this.cities.filter(city => city.city_name.toLowerCase().includes(keyword)))
      );

      // --- LocalStorage’dan gelen IATA’ları City objesine map’le ---
      this.hydrateControlsFromIata();
    });
  }

private hydrateControlsFromIata() {
    // Departure
    const depVal = this.departureCityControl.value;
    const originIata = (typeof depVal === 'string' ? depVal : depVal?.city_iata_code || this.originLocationCode || '').toUpperCase();
    if (originIata) {
      const depCity = this.cities.find(c => (c.city_iata_code || '').toUpperCase() === originIata);
      if (depCity) {
        this.departureCityControl.setValue(depCity, { emitEvent: false }); // City objesi set
        this.originLocationCode = depCity.city_iata_code.toUpperCase();
      }
    }

    // Destination
    const destVal = this.destinationCityControl.value;
    const destinationIata = (typeof destVal === 'string' ? destVal : destVal?.city_iata_code || this.destinationLocationCode || '').toUpperCase();
    if (destinationIata) {
      const destCity = this.cities.find(c => (c.city_iata_code || '').toUpperCase() === destinationIata);
      if (destCity) {
        this.destinationCityControl.setValue(destCity, { emitEvent: false });
        this.destinationLocationCode = destCity.city_iata_code.toUpperCase();
      }
    }
  }


  private extractIataFromControl(ctrl: FormControl<string | City | null>): string | null {
    const val = ctrl.value;
    if (!val) return null;
    if (typeof val === 'string') {
      const raw = val.trim();
      const maybeIata = raw.toUpperCase();
      if (/^[A-Z]{3}$/.test(maybeIata)) return maybeIata;
      const match = this.cities.find(c => c.city_name.toLowerCase() === raw.toLowerCase());
      return match?.city_iata_code?.toUpperCase() || null;
    }
    return val.city_iata_code?.toUpperCase() || null;
  }

  displayCity(city: City | string | null): string {
    if (!city) return '';
    return typeof city === 'string' ? city : city.city_name;
  }

  onDepartureCitySelectedFlight(city: City): void {
    this.originLocationCode = city.city_iata_code.toUpperCase();
  }

  onDestinationCitySelectedFlight(city: City): void {
    this.destinationLocationCode = city.city_iata_code.toUpperCase();
  }

  openSummaryModal() {
    this.dialog.open(SummaryModal, {
      width: '600px',
      height: 'auto'
    });
  }

  continueWithoutFlight() {
    const storedData = localStorage.getItem('travelSearchData');
    const parsedData = storedData ? JSON.parse(storedData) : {};

    parsedData.selectedFlight = {
      passed: true,
      selected: true
    };

    if (!parsedData.departure_date) {
      parsedData.departure_date = this.departureDate;
    }
    localStorage.setItem('travelSearchData', JSON.stringify(parsedData));
    console.log('➡ Uçuş seçmeden devam ediliyor:', parsedData);
    this.tripState.checkSummaryVisibility();

    if (!parsedData.selectedHotel?.selected) {
      console.log('➡ Navigating to /hotels');
      this.router.navigate(['/hotels'], { queryParams: { from: 'flight-offers' } });
    } else if (!parsedData.selectedFlight?.selected) {
      console.log('➡ Navigating to /flight-offers');
      this.router.navigate(['/flight-offers'], { queryParams: { from: 'hotels' } });
    } else {
      console.log('➡ Navigating to /summary');
      this.openSummaryModal();
    }
  }

  searchFlights() {
    const originIata = this.extractIataFromControl(this.departureCityControl);
    const destIata = this.extractIataFromControl(this.destinationCityControl);
    if (originIata) this.originLocationCode = originIata;
    if (destIata) this.destinationLocationCode = destIata;

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
      passed: false,
      from: offer.itineraries[0]?.segments[0]?.departure?.iataCode,
      to: offer.itineraries[0]?.segments[0]?.arrival?.iataCode,
      name: offer.itineraries[0]?.segments[0]?.carrierCode + " " + offer.itineraries[0]?.segments[0]?.number,
      price: offer.price?.total + " " + offer.price?.currency
    };

    parsedData.departure_date = this.departureDate;

    localStorage.setItem('travelSearchData', JSON.stringify(parsedData));
    console.log('✅ Flight saved to LocalStorage:', parsedData);
    this.tripState.checkSummaryVisibility();
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