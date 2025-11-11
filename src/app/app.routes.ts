import { Routes } from '@angular/router';
import { FlightSearch } from './components/flight-search/flight-search';
import { HotelSearch } from './components/hotel-search/hotel-search';
import { Search } from './components/search/search';

export const routes: Routes = [
  {
    path: "travel-recommendation",
    component: Search
  },
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
    redirectTo: 'travel-recommendation',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'travel-recommendation'
  }
];