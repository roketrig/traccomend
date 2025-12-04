
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from './shared/search';
import { TripStateService } from './global-state/trip-state.service';
import { MatDialog } from '@angular/material/dialog';
import { SummaryModal } from './components/summary-modal/summary-modal';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,

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
  showSummaryButton = false;

  constructor(private router: Router, private searchService: SearchService, private tripState: TripStateService, private dialog: MatDialog) { }

  ngOnInit() {
    this.tripState.summaryVisible$.subscribe(visible => {
      this.showSummaryButton = visible;
    });
    this.tripState.checkSummaryVisibility();
  }


  openSummaryModal() {
    this.dialog.open(SummaryModal, {
      width: '600px',
      height: 'auto'
    });
  }


  get selectedTabIndex(): number {
    const url = this.router.url;
    const idx = this.tabs.findIndex(tab => url.startsWith(tab.route));
    return idx >= 0 ? idx : -1; 
  }
  // plane offset.
  planeX = '320px';
  lineWidth = '0px';
  lineOffset = '320px';


  onTabChange(index: number) {
    if (this.selectedTabIndex === -1) {
      console.log('✅ Tab dışı sayfa, yönlendirme yapılmadı.');
      return;
    }

    const route = this.tabs[index]?.route;
    if (route && this.router.url !== route) {
      console.log(`➡ Navigating to ${route}`);
      this.router.navigate([route]);
    }

    const tabCount = this.tabs.length;
    const navbarWidth = window.innerWidth;
    const step = navbarWidth / tabCount;
    const iconHalf = 20;
    const offset = 318;
    const x = index * step + step / 2 - iconHalf;
    this.planeX = `${x}px`;
    this.lineWidth = `${x - offset > 0 ? x - offset : 0}px`;


    console.log('Current URL:', this.router.url);
    console.log('Selected Tab Index:', this.selectedTabIndex);

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
