import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← FormsModule ekle
import { TravelHotelSearch } from '../../services/travel-hotel-search/travel-hotel-search';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hotel-search',
  standalone: true,
  imports: [CommonModule, FormsModule], // ← FormsModule ekle
  templateUrl: './hotel-search.html',
  styleUrls: ['./hotel-search.css']
})
export class HotelSearch {
  hotels: any[] = [];
  isLoading = false;
  error = '';
  cityCode = 'PAR'; // ← Varsayılan değer

  constructor(private hotelService: TravelHotelSearch) {}

  searchHotels() {
    if (!this.cityCode || this.cityCode.length !== 3) {
      this.error = 'Lütfen geçerli bir 3 harfli şehir kodu girin (Örnek: PAR, LON)';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.hotels = [];

    // Büyük harfe çevir
    const city = this.cityCode.toUpperCase();

    this.hotelService.getHotelIds(city).pipe(
      switchMap((hotelIds: string[]) => {
        console.log('Hotel IDs for', city, ':', hotelIds);
        
        if (hotelIds.length === 0) {
          throw new Error(`${city} şehrinde otel bulunamadı`);
        }

        console.log('Searching offers for hotel IDs:', hotelIds);
        return this.hotelService.searchHotelOffers(hotelIds);
      })
    ).subscribe({
      next: (res: any) => {
        console.log('Full API Response:', res);
        
        const raw = res.data ?? [];
        
        if (raw.length) {
          console.log("First hotel raw item:", raw[0]);
        }

        // Hotel bilgilerini işle
        this.hotels = raw.map((item: any) => {
          const h = item.hotel ?? item;

          return {
            name: h.name ?? 'Bilinmeyen Otel',
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
        console.error('Hotel API Error:', err);
        this.isLoading = false;
        this.error = err.message || 'Oteller aranırken bir hata oluştu';
      }
    });
  }
}