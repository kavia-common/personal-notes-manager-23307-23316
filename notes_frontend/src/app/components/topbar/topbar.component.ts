import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * TopbarComponent displays quick actions like create and a search input.
 */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  @Output() create = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  // PUBLIC_INTERFACE
  onCreate() {
    this.create.emit();
  }

  // PUBLIC_INTERFACE
  onSearch(term: string) {
    this.search.emit(term);
  }

  // PUBLIC_INTERFACE
  /** Handle input event from search box and emit the string value safely. */
  onSearchInput(event: any) {
    const input = (event && event.target) ? (event.target as any) : null;
    const value: string = input && typeof input.value === 'string' ? input.value : '';
    this.onSearch(value);
  }
}
