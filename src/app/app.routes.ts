import { Routes } from '@angular/router';
import { FlightSearch } from './components/flight-search/flight-search';
import { HotelSearch } from './components/hotel-search/hotel-search';
import { Search } from './components/search/search';
import { ResultComponent } from './components/result/result';
import { SearchAIComponent } from './components/search-ai/search-ai';

export const routes: Routes = [
  {
    path: 'ai-search',
    component: SearchAIComponent
  },
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
    path: 'result',
    component: ResultComponent
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