import { Routes } from '@angular/router';
import { FlightSearch } from './features/flight-search/flight-search';
import { HotelSearch } from './features/hotel-search/hotel-search';
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