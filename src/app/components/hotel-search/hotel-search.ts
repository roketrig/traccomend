import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelHotelSearch } from '../../services/travel-hotel-search/travel-hotel-search';
import { SearchService } from '../../shared/search';
import { MapComponent } from '../map-component/map-component';
import { Search } from '../search/search';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  city = ''
  IATACode = ""
  targetedCity = ""

  constructor(
    private hotelService: TravelHotelSearch,
    private searchService: SearchService,
  ) { }
  // stored data = IATA code 
  ngOnInit() {
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
    const parsedData = storedData ? JSON.parse(storedData) : null;
    // <div *ngFor="let h of hotels.slice(0, 12); let i = index" class="hotel-card">
    //           <h3 class="hotel-name">{{ i + 1 }}. {{ h.name }}</h3>

    //           <div class="hotel-details">
    //             <div class="detail-item">
    //               <span class="detail-label">🏷️ Hotel ID:</span>
    //               <span class="detail-value">{{ h.hotelId }}</span>
    //             </div>
    //             <div class="detail-item">
    //               <span class="detail-label">🔗 Dupe ID:</span>
    //               <span class="detail-value">{{ h.dupeId || 'N/A' }}</span>
    //             </div>
    //             <div class="detail-item">
    //               <span class="detail-label">🏢 Chain:</span>
    //               <span class="detail-value">{{ h.chainCode || 'N/A' }}</span>
    //             </div>
    //             <div class="detail-item">
    //               <span class="detail-label">🏙️ City:</span>
    //               <span class="detail-value">{{ h.cityCode || 'N/A' }}</span>
    //             </div>
    //             <div class="detail-item">
    //               <span class="detail-label">📍 Latitude:</span>
    //               <span class="detail-value">{{ h.latitude || 'N/A' }}</span>
    //             </div>
    //             <div class="detail-item">
    //               <span class="detail-label">📍 Longitude:</span>
    //               <span class="detail-value">{{ h.longitude || 'N/A' }}</span>
    //             </div>
    //             <button (click)="selectHotel(h)" (click)="hotelLocation(h.latitude, h.longitude)">📍 Select</button>

    //           </div>
    //         </div>

    parsedData.selectedHotel.name = hotel.name;

    let nights = 0;
    if (parsedData.departure_date && parsedData.return_date) {
      const start = new Date(parsedData.departure_date);
      const end = new Date(parsedData.return_date);
      const diff = end.getTime() - start.getTime();
      nights = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
    }
    parsedData.selectedHotel.nights = nights;
    parsedData.selectedHotel.latitude = hotel.latitude;
    parsedData.selectedHotel.longitude = hotel.longitude;
    parsedData.count = (parsedData.count || 0) + 1;
    localStorage.setItem('travelSearchData', JSON.stringify(parsedData));
    console.log('✅ Flight saved to LocalStorage:', parsedData);
  }

}
