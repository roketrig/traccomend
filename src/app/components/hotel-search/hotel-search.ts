import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelHotelSearch } from '../../services/travel-hotel-search/travel-hotel-search';
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
      error: (err: { message: string; }) => {
        this.isLoading = false;
        this.error = err.message || 'An error occurred while searching for hotels';
      }
    });
  }
}