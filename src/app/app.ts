import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from './shared/search';
import { SearchBarComponent } from './components/search-bar/search-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    SearchBarComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  tabs = [
    { route: "/travel-recommendation" },
    { route: '/flight-offers' },
    { route: '/hotels' }
  ];

  cityCode = '';

  constructor(private router: Router, private searchService: SearchService) {}

  get selectedTabIndex(): number {
    const url = this.router.url;
    const idx = this.tabs.findIndex(tab => url.startsWith(tab.route));
    return idx >= 0 ? idx : 0;
  }

  onTabChange(index: number) {
    const route = this.tabs[index]?.route;
    if (route) {
      this.router.navigate([route]);
    }
  }

  onCityCodeChange(value: string) {
    this.cityCode = value;
    this.searchService.updateCityCode(value);
  }
handleSearch(cityCode: string) {
  this.searchService.updateCityCode(cityCode);
  this.router.navigate(['/hotels']); // 🔥 Otel sayfasına yönlendir
}
}
