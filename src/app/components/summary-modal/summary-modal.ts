
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { jsPDF } from "jspdf";
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-summary-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule],
  templateUrl: './summary-modal.html',
  styleUrls: ['./summary-modal.css']
})
export class SummaryModal implements OnInit {
  summaryData: any;

  constructor(private router: Router, private dialogRef: MatDialogRef<SummaryModal>) {dialogRef.disableClose = true; }

  ngOnInit() {
    const storedData = localStorage.getItem('travelSearchData');
    this.summaryData = storedData ? JSON.parse(storedData) : null;
    console.log('✅ Summary Modal Data:', this.summaryData);
  }

  startNewSearch() {
    localStorage.removeItem('travelSearchData'); 
    this.dialogRef.close(); 
    this.router.navigate(['/travel-recommendation']);
    
  }

  @ViewChild('summaryContent') summaryContent!: ElementRef;

  downloadPdf() {
    const element = this.summaryContent.nativeElement;


    const options: any = {
      margin: 0.5,
      filename: 'travel-summary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  }


}