import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { CityService, City } from '../../services/city-search/cities';
import { searchInterface } from '../../search.model';
import { Router } from '@angular/router';
import { TripStateService } from '../../global-state/trip-state.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search implements OnInit {
  @Output() searchCompleted = new EventEmitter<void>();

  targetCityControl = new FormControl('');
  departureCityControl = new FormControl('');
  originCityControl = new FormControl('');

  cities: City[] = [];
  filteredTargetCities!: Observable<City[]>;
  filteredDepartureCities!: Observable<City[]>;
  filteredOriginCities!: Observable<City[]>;

  selectedTargetCity: City | null = null;
  selectedDepartureCity: City | null = null;
  selectedOriginCountry: City | null = null;

  departureDate = '';
  returnDate = '';
  adult = 1;

  showMoreDetails = false;

  constructor(private cityService: CityService, private router: Router, private tripState: TripStateService) { }

  ngOnInit(): void {
    this.cityService.getCities().subscribe(data => {
      this.cities = data;

      this.filteredTargetCities = this.targetCityControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value.trim().toLowerCase() : ''),
        map(keyword => this.cities.filter(city =>
          city.city_name.toLowerCase().includes(keyword)
        ))
      );

      this.filteredDepartureCities = this.departureCityControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value.trim().toLowerCase() : ''),
        map(keyword => this.cities.filter(city =>
          city.city_name.toLowerCase().includes(keyword)
        ))
      );

      this.filteredOriginCities = this.originCityControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value.trim().toLowerCase() : ''),
        map(keyword => this.cities.filter(city =>
          city.country_name.toLowerCase().includes(keyword)
        ))
      );

    });
  }


  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  displayCity(city: City): string {
    return city ? city.city_name : '';
  }

  displayCountry(city: City): string {
    return city ? city.country_name : '';
  }

  onTargetCitySelected(city: City): void {
    this.selectedTargetCity = city;
    console.log('Gidilecek şehir:', city.city_name);
  }

  onDepartureCitySelected(city: City): void {
    this.selectedDepartureCity = city;
    console.log('Başlangıç şehir:', city.city_name);
  }

  onOriginCitySelected(city: City): void {
    this.selectedOriginCountry = city;
    console.log('Nerelisin:', city.country_name);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.selectedTargetCity || !this.selectedDepartureCity) {
      alert('Please select both departure and destination cities.');
      return;
    }

    const payload: searchInterface = {
      target_city: this.selectedTargetCity.city_name,
      target_city_iata_code: this.selectedTargetCity.city_iata_code,
      origin_country: this.selectedOriginCountry?.country_name || '',
      origin_country_code: this.selectedOriginCountry?.country_code || "",
      departure_city: this.selectedDepartureCity.city_name,
      departure_city_iata_code: this.selectedDepartureCity.city_iata_code,
      adult: this.adult,
      departure_date: this.departureDate,
      return_date: this.returnDate,
      selectedFlight: {
        passed: false,
        selected: false,
        from: "",
        to: "",
        name: "",
        price: "",
      },
      selectedHotel: {
        passed: false,
        selected: false,
        name: "",
        nights: 0,
        latitude: 0,
        longitude: 0,
      }
    };

    console.log('Data to be sent to API:', payload);
    localStorage.setItem('travelSearchData', JSON.stringify(payload));
    this.tripState.checkSummaryVisibility();

    this.searchCompleted.emit();
    this.router.navigate(['/result']);
  }
}