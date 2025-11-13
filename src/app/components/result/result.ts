import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelRecommendations } from '../../services/travel-recommendations/travel-recommendations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrls: ['./result.css']
})
export class ResultComponent implements OnInit {
  recommendations: any[] = [];

  constructor(private travelService: TravelRecommendations, private router: Router) { }

  ngOnInit(): void {
    this.fetchRecommendations();
  }

  fetchRecommendations() {
    const storedData = localStorage.getItem("travelSearchData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const city = parsedData.target_city;
      const country = parsedData.origin_country_code;

      if (city && country) {
        this.travelService.getRecommendations(city.slice(0, 3).toUpperCase(), country.toUpperCase()).subscribe({
          next: (data) => {
            this.recommendations = data.data; // API response formatına göre
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

  goBack(): void {
    this.router.navigate(['/search']); // Arama sayfasının route'u
  }

}