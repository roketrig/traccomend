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
  templateUrl: './app.html',
})
export class App {
  tabs = [
    { route: "/travel-recommendation" },
    { route: '/flight-offers' },
    { route: '/hotels' }
  ];

  constructor(private router: Router) { }

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