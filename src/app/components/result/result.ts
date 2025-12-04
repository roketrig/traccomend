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

  recommendations: any[] = [
    {
      type: 'recommended-location',
      subtype: 'CITY',
      name: 'PARIS',
      iataCode: 'PAR',
      geoCode: { longitude: 2.34276, latitude: 48.85755 },
      relevance: 0.71
    },
    {
      type: 'recommended-location',
      subtype: 'CITY',
      name: 'MADRID',
      iataCode: 'MAD',
      geoCode: { longitude: 3.70348, latitude: 40.41654 },
      relevance: 0.68
    }
  ];

  constructor(private travelService: TravelRecommendations, private router: Router) { }

  ngOnInit(): void {
    // this.fetchRecommendations();
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
            this.recommendations = data.data; 
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
  selectedCity: any = null;

  selectCity(city: any) {
    this.selectedCity = city;
  }

  updateSelectedCity(type: 'hotels' | 'flights') {
    const storedData = localStorage.getItem('travelSearchData');
    if (storedData && this.selectedCity) {
      const payload = JSON.parse(storedData);
      payload.target_city = this.selectedCity.name;
      payload.target_city_iata_code = this.selectedCity.iataCode;

      localStorage.setItem('travelSearchData', JSON.stringify(payload));
      console.log('Updated travelSearchData:', payload);

      if (type === 'hotels') {
        this.router.navigate(['/hotels'], { queryParams: { from: 'result' } });
      } else {
        this.router.navigate(['/flight-offers'], { queryParams: { from: 'result' } });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }
}