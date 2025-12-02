import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TravelHotelSearch } from '../../services/travel-hotel-search/travel-hotel-search';
import { SearchService } from '../../shared/search';
import { MapComponent } from '../map-component/map-component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SummaryModal } from '../summary-modal/summary-modal';
import { TripStateService } from '../../global-state/trip-state.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { City, CityService } from '../../services/city-search/cities';

@Component({
  selector: 'app-hotel-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MapComponent, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule],
  templateUrl: './hotel-search.html',
  styleUrls: ['./hotel-search.css']
})
export class HotelSearch implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  hotels: any[] = [];
  isLoading = false;
  error = '';
  cityCode = '';
  showHotelSearch = false;
  city = '';
  IATACode = "";
  targetedCity = "";
  showContinueButton = false;
  nightInfo = 0;

  startDate: string = '';
  endDate: string = '';
  showDateInputs = false;

  // Autocomplete için
  hotelCityControl = new FormControl('');
  filteredHotelCities!: Observable<City[]>;
  selectedHotelCity: City | null = null;
  cities: City[] = [];

  constructor(
    private hotelService: TravelHotelSearch,
    private searchService: SearchService,
    private cityService: CityService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private tripState: TripStateService
  ) { }
  // stored data = IATA code 



  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['from'] === 'result' || params['from'] === 'flight-offers') {
        this.showContinueButton = true;
      }

      const storedData = localStorage.getItem('travelSearchData');
      const parsedData = storedData ? JSON.parse(storedData) : null;

      if (parsedData) {
        this.endDate = parsedData.return_date;
        this.startDate = parsedData.departure_date;
      }

      // Şehir listesini yükle
      this.cityService.getCities().subscribe(data => {
        this.cities = data;

        this.filteredHotelCities = this.hotelCityControl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value.trim().toLowerCase() : ''),
          map(keyword => this.cities.filter(city =>
            city.city_name.toLowerCase().includes(keyword)
          ))
        );

        // Eğer önceden seçilmiş şehir varsa inputa yaz ve seçili hale getir
        if (parsedData?.target_city) {
          this.hotelCityControl.setValue(parsedData.target_city);

          const matchedCity = this.cities.find(c =>
            c.city_name.toLowerCase() === parsedData.target_city.toLowerCase()
          );
          if (matchedCity) {
            this.selectedHotelCity = matchedCity;

            // ✅ Eğer result'tan geldiyse otomatik otel araması başlat
            if (params['from'] === 'result') {
              this.searchHotels();
            }
          }
        }
      });
    });
  }

  displayCity(city: City | string): string {
    return typeof city === 'string' ? city : city?.city_name || '';
  }

  onHotelCitySelected(city: City): void {
    this.selectedHotelCity = city;
    console.log('Selected city for hotel search:', city.city_name);
  }

  openSummaryModal() {
    this.dialog.open(SummaryModal, {
      width: '600px',
      height: 'auto'
    });
  }

  toggleDateInputs() {
    this.showDateInputs = !this.showDateInputs;
  }

  continueWithoutHotel() {
    const storedData = localStorage.getItem('travelSearchData');
    const parsedData = storedData ? JSON.parse(storedData) : {};

    parsedData.selectedHotel = {
      passed: true,
      selected: true
    };

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

  searchHotels() {
    const storedData = localStorage.getItem('travelSearchData');
    const parsedData = storedData ? JSON.parse(storedData) : {};

    if (!this.selectedHotelCity) {
      this.error = 'Please select a city for hotel search.';
      return;
    }

    const iataCode = this.selectedHotelCity.city_iata_code;
    this.isLoading = true;
    this.error = '';
    this.hotels = [];

    this.hotelService.searchHotelsByCity(iataCode).subscribe({
      next: (res: any) => {
        const raw = res.data ?? [];
        this.hotels = raw.map((item: any) => ({
          name: item.name ?? 'Unknown Hotel',
          hotelId: item.hotelId ?? 'N/A',
          chainCode: item.chainCode ?? null,
          latitude: item.geoCode?.latitude ?? null,
          longitude: item.geoCode?.longitude ?? null,
          address: {
            cityName: item.address?.cityName ?? 'N/A',
            countryCode: item.address?.countryCode ?? 'N/A',
            postalCode: item.address?.postalCode ?? 'N/A',
            lines: item.address?.lines ?? []
          },
          distance: {
            unit: item.distance?.unit,
            value: item.distance?.value
          }
        }));
        this.isLoading = false;
      },
      error: (err: { message: string }) => {
        this.isLoading = false;
        this.error = err.message || 'An error occurred while searching for hotels';
      }
    });
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (end > start) {
      parsedData.return_date = this.endDate;
      parsedData.departure_date = this.startDate;
    }
    localStorage.setItem('travelSearchData', JSON.stringify(parsedData));
  }

  addedEndDate() {
    let nights = 0;
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      if (end >= start) {
        const diff = end.getTime() - start.getTime();
        nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
      } else {
        nights = 0;
      }
    }
    this.nightInfo = nights;
  }


  getSegment(chainCode: string): string {
    const luxuryChains = ['HH', 'HY', 'MR', 'RC', 'FS', 'HN', 'RT', 'LX', 'DH', 'AC', 'EU'];
    // Hilton, Hyatt, Marriott, Ritz Carlton, Four Seasons, HN, RT, LX, DH, AC, EU gibi lüks zincirler

    const midChains = ['BW', 'CP', 'NN', 'YX', 'HI', 'AZ', 'MC', 'OI', 'VP', 'XL'];
    // Best Western, Crowne Plaza, Campanile, Holiday Inn, vb. + VP, XL

    const budgetChains = ['IB', 'ET', 'ZZ', 'GT'];
    // Ibis, Etap, vb. + GT

    if (luxuryChains.includes(chainCode)) return 'Luxury';
    if (midChains.includes(chainCode)) return 'Mid-range';
    if (budgetChains.includes(chainCode)) return 'Budget';
    return 'Independent';
  }

  hotelLocation(lat: number, lng: number) {
    if (this.mapComponent) {
      this.mapComponent.updateLocation(lng, lat);
    }
  }
  openHotelSearch() {
    this.showHotelSearch = true;
  }

  selectHotel(hotel: any) {
    const storedData = localStorage.getItem('travelSearchData');
    const parsedData = storedData ? JSON.parse(storedData) : {};

    let nights = 1;
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const diff = end.getTime() - start.getTime();
      parsedData.return_date = this.endDate;
      nights = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
    } else if (parsedData.departure_date && parsedData.return_date) {
      const start = new Date(parsedData.departure_date);
      const end = new Date(parsedData.return_date);
      const diff = end.getTime() - start.getTime();
      nights = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
    }
    parsedData.return_date = this.endDate;

    parsedData.selectedHotel = {
      selected: true,
      name: hotel.name,
      nights: nights,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      address: hotel.address.lines.join(', ') + " " + hotel.address.cityName
    };

    localStorage.setItem('travelSearchData', JSON.stringify(parsedData));
    console.log('✅ Hotel saved to LocalStorage:', parsedData);
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
