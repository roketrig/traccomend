
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiRecommendationService } from '../../services/ai-recommendation/airecommendation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-ai',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './search-ai.html',
  styleUrls: ['./search-ai.css']
})
export class SearchAIComponent implements OnInit {
  countryControl = new FormControl('');
  interestControl = new FormControl('');
  recommendedCities: string[] = [];
  loading = false;
  errorMessage = '';

  constructor(private aiRecommendationService: AiRecommendationService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const country = this.countryControl.value?.trim() || '';
    const interests = this.interestControl.value?.trim() || '';

    if (!country || !interests) {
      this.errorMessage = 'Please enter both country and interests.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.aiRecommendationService.getRecommendations(country, interests)
      .subscribe({
        next: (data) => {
          const text = data.candidates[0].content.parts[0].text;
          this.recommendedCities = text.split('\n').filter((line: string) => line.trim() !== '');
          this.loading = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.errorMessage = 'Failed to fetch recommendations. Please try again.';
          this.loading = false;
        }
      });
  }
}
