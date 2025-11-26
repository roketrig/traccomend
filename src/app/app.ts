
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from './shared/search';
import { Enter } from './enter/enter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    Enter
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  tabs = [
    { route: '/travel-recommendation' },
    { route: '/flight-offers' },
    { route: '/hotels' }
  ];

  cityCode = '';

  constructor(private router: Router, private searchService: SearchService) { }

  get selectedTabIndex(): number {
    const url = this.router.url;
    const idx = this.tabs.findIndex(tab => url.startsWith(tab.route));
    return idx >= 0 ? idx : 0;
  }


  // plane offset.
  planeX = '0px';
  lineWidth = '0px';
  lineOffset = '150px';


  onTabChange(index: number) {
    const tabCount = this.tabs.length;
    const navbarWidth = window.innerWidth;
    const step = navbarWidth / tabCount;
    const iconHalf = 20;
    const offset = 148;
    const route = this.tabs[index]?.route; if (route) { this.router.navigate([route]); }
    const x = index * step + step / 2 - iconHalf;
    this.planeX = `${x}px`;

    const width = x - offset > 0 ? x - offset : 0;
    this.lineWidth = `${width}px`;
  }



  onCityCodeChange(value: string) {
    this.cityCode = value;
    this.searchService.updateCityCode(value);
  }

  handleSearch(cityCode: string) {
    this.searchService.updateCityCode(cityCode);
    this.router.navigate(['/hotels']);
  }

  getPlanePosition(): string {
    const navbarWidth = window.innerWidth;
    const tabCount = this.tabs.length;
    const step = navbarWidth / tabCount;
    return `translateX(${this.selectedTabIndex * step}px)`;
  }

}
