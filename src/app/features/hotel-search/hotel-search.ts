import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelHotelSearch } from '../../services/travel-hotel-search/travel-hotel-search';
import { switchMap } from 'rxjs/operators';
import { SearchService } from '../../shared/search';

@Component({
  selector: 'app-hotel-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-search.html',
  styleUrls: ['./hotel-search.css']
})
export class HotelSearch implements OnInit {
  hotels: any[] = [];
  isLoading = false;
  error = '';
  cityCode = '';

  constructor(
    private hotelService: TravelHotelSearch,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.searchService.cityCode$.subscribe(code => {
      if (code && code.length === 3) {
        this.searchHotels(code);
      }
    });
  }

  searchHotels(cityCode: string) {
    this.cityCode = cityCode.toUpperCase();
    this.isLoading = true;
    this.error = '';
    this.hotels = [];

    this.hotelService.getHotelIds(this.cityCode).pipe(
      switchMap((hotelIds: string[]) => {
        if (hotelIds.length === 0) {
          throw new Error(`${this.cityCode} No hotels found in the city`);
        }
        return this.hotelService.searchHotelOffers(hotelIds);
      })
    ).subscribe({
      next: (res: any) => {
        const raw = res.data ?? [];
        this.hotels = raw.map((item: any) => {
          const h = item.hotel ?? item;
          return {
            name: h.name ?? 'unknown Hotel',
            hotelId: h.hotelId ?? h.id ?? 'N/A',
            dupeId: item.dupeId ?? h.dupeId ?? null,
            chainCode: h.chainCode ?? item.chainCode ?? null,
            cityCode: item.cityCode ?? item.address?.cityCode ?? null,
            latitude: h.latitude ?? item.geoCode?.latitude ?? null,
            longitude: h.longitude ?? item.geoCode?.longitude ?? null,
            type: item.type || 'hotel'
          };
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.message || 'An error occurred while searching for hotels';
      }
    });
  }
}
