import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './search-bar.html',
})
export class SearchBarComponent {
  cityCode = '';
  isLoading = false;

  @Output() actionTriggered = new EventEmitter<string>();

  triggerAction() {
    this.actionTriggered.emit(this.cityCode);
  }
}
