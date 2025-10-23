import { Routes } from '@angular/router';
import { FlightSearch } from './features/flight-search';
import { HotelSearch } from './features/hotel-search';

export const routes: Routes = [
  { 
    path: 'flight-offers', 
    component: FlightSearch
  },
  { 
    path: 'hotels', 
    component: HotelSearch
  },
  { 
    path: '', 
    redirectTo: 'flight-offers', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'flight-offers' 
  }
];