import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Note } from '../../models/note.model';

/**
 * NoteListComponent shows a scrollable list of notes, emits selection events.
 */
@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedId: string | null = null;
  @Output() select = new EventEmitter<string>();

  // PUBLIC_INTERFACE
  onSelect(id: string) {
    this.select.emit(id);
  }

  // PUBLIC_INTERFACE
  trackById(_: number, item: Note) {
    return item.id;
  }
}
