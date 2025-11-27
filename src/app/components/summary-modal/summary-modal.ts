
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule],
  templateUrl: './summary-modal.html',
  styleUrls: ['./summary-modal.css']
})
export class SummaryModal implements OnInit {
  summaryData: any;

  constructor(private router: Router, private dialogRef: MatDialogRef<SummaryModal>) {}

  ngOnInit() {
    const storedData = localStorage.getItem('travelSearchData');
    this.summaryData = storedData ? JSON.parse(storedData) : null;
    console.log('✅ Summary Modal Data:', this.summaryData);
  }

  // ✅ Yeni arama başlatma fonksiyonu
  startNewSearch() {
    localStorage.removeItem('travelSearchData'); // LocalStorage temizle
    this.dialogRef.close(); // Modal kapat
    this.router.navigate(['/travel-recommendation']); // Yönlendirme
  }
}
