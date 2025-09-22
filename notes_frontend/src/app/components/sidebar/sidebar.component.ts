import { Component, EventEmitter, Output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SidebarComponent renders the navigation area with a New Note button and space
 * for future sections. Emits create action to parent.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() create = new EventEmitter<void>();

  // PUBLIC_INTERFACE
  /** Trigger create event to parent */
  onCreate() {
    this.create.emit();
  }
}
