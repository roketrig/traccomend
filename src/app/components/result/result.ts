import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelRecommendations } from '../../services/travel-recommendations/travel-recommendations';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrls: ['./result.css']
})
export class Result implements OnInit {
  recommendations: any[] = [];

  constructor(private travelService: TravelRecommendations) { }

  ngOnInit(): void {
    this.fetchRecommendations();
  }

  fetchRecommendations() {
    const storedData = localStorage.getItem("travelSearchData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);

      const city = parsedData?.location?.name ?? '';
      const country = parsedData?.travellerCountry?.name ?? parsedData?.travellerCountry ?? 'FR';

      console.log('Şehir:', city);
      console.log('Ülke:', country);

      if (city && country) {
        this.travelService.getRecommendations(city.slice(0, 3).toUpperCase(), country.toUpperCase()).subscribe({
          next: (data) => {
            this.recommendations = data.data;
            console.log(this.recommendations);
          },
          error: (err) => {
            console.error('API hatası:', err);
          }
        });
      } else {
        console.warn('Şehir veya ülke bilgisi eksik.');
      }
    }
  }
}