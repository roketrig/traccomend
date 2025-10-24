import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { map, Observable, of, startWith, switchMap } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitySearch } from '../../services/city-search/city-search';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  @Output() searchCompleted = new EventEmitter<void>();
  selectedCity: { name: string } | null = null;
  selectedCountry: { name: string } | null = null;
  duration: number = 0;
  budget: number = 0;

  constructor(private cityService: CitySearch) { }

  cityControl = new FormControl('');
  allAirports: any[] = [];
  filteredCities!: Observable<string[]>;
  selectedCityAirports: any[] = [];


  ngOnInit(): void {

    this.cityService.getCity('istanbul').subscribe({
      next: res => console.log(res),
      error: err => console.error('API hatası:', err)
    });

    this.filteredCities = this.cityControl.valueChanges.pipe(
      startWith(''),
      map((value) => (value ?? '').trim()),
      switchMap(value => {
        if (!value || value.length < 2) {
          return of([]); // Boş veya çok kısa ise boş liste döndür
        }
        return this.cityService.getCity(value).pipe(
          map(response => {
            this.allAirports = response.data;
            const cities = [...new Set(this.allAirports.map(a => a.name))];
            return cities;
          })
        );
      })
    );
  }


  onCitySelected(cityName: string) {
    this.selectedCityAirports = this.allAirports.filter(a => a.name === cityName);
    console.log('Seçilen şehirdeki IATA kodları:', this.selectedCityAirports.map(a => a.iataCode));
  }
  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.selectedCity) {
      alert("Please select a location.");
      return;
    }

    if (!this.selectedCountry) {
      alert("Please select your country.");
      return;
    }

    const payload = {
      location: this.selectedCity,
      travellerCountry: this.selectedCountry,
      duration: this.duration,
      budget: this.budget
    };

    console.log("Data to be sent to API:", payload);
    localStorage.setItem('travelSearchData', JSON.stringify(payload));
    this.searchCompleted.emit(); // Ana component'e bildir
  }
}