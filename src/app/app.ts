import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule
  ],
  template: `
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">TravelApp</h1>
        <nav>
          <mat-tab-group 
            [selectedIndex]="selectedTabIndex"
            (selectedIndexChange)="onTabChange($event)">
            <mat-tab label="FLIGHT OFFERS"></mat-tab>
            <mat-tab label="HOTELS"></mat-tab>
          </mat-tab-group>
        </nav>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {
  tabs = [
    { route: '/flight-offers' },
    { route: '/hotels' }
  ];

  constructor(private router: Router) {}

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
}