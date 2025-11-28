import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelHotelSearch } from '../../services/travel-hotel-search/travel-hotel-search';
import { SearchService } from '../../shared/search';
import { MapComponent } from '../map-component/map-component';
import { Search } from '../search/search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SummaryModal } from '../summary-modal/summary-modal';

@Component({
  selector: 'app-hotel-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MapComponent, MatFormFieldModule],
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

  constructor(
    private hotelService: TravelHotelSearch,
    private searchService: SearchService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }
  // stored data = IATA code 
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['from'] === 'result' || params['from'] === "flight-offers") {
        this.showContinueButton = true;
      }
    });
    this.searchService.cityCode$.subscribe(code => {
      const storedData = localStorage.getItem("travelSearchData");
      const parsedData = storedData ? JSON.parse(storedData) : null;
      if (parsedData) {
        const iataCode = parsedData.target_city_iata_code;
        this.cityCode = iataCode;
        this.targetedCity = parsedData.target_city_targetedCity
      }
    });
  }

  openSummaryModal() {
    this.dialog.open(SummaryModal, {
      width: '600px',
      height: 'auto'
    });
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

  searchHotels(cityCode: string) {
    this.cityCode = cityCode.toUpperCase();
    this.isLoading = true;
    this.error = '';
    this.hotels = [];


    this.hotelService.searchHotelsByCity(this.cityCode).subscribe({
      next: (res: any) => {
        const raw = res.data ?? [];
        this.hotels = raw.map((item: any) => ({
          name: item.name ?? 'Unknown Hotel',
          hotelId: item.hotelId ?? 'N/A',
          dupeId: item.dupeId ?? null,
          chainCode: item.chainCode ?? null,
          cityCode: item.address?.cityCode ?? this.cityCode,
          latitude: item.geoCode?.latitude ?? null,
          longitude: item.geoCode?.longitude ?? null,
          type: item.type || 'hotel'
        }));
        this.isLoading = false;
      },
      error: (err: { message: string }) => {
        this.isLoading = false;
        this.error = err.message || 'An error occurred while searching for hotels';
      }
    });
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
    if (parsedData.departure_date && parsedData.return_date) {
      const start = new Date(parsedData.departure_date);
      const end = new Date(parsedData.return_date);
      const diff = end.getTime() - start.getTime();
      nights = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
    }

    parsedData.selectedHotel = {
      selected: true,
      name: hotel.name,
      nights: nights,
      latitude: hotel.latitude,
      longitude: hotel.longitude
    };

    localStorage.setItem('travelSearchData', JSON.stringify(parsedData));
    console.log('✅ Hotel saved to LocalStorage:', parsedData);


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
