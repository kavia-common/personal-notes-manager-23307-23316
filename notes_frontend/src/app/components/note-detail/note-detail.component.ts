import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

/**
 * NoteDetailComponent allows editing the selected note with Save/Delete actions.
 */
@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.css'
})
export class NoteDetailComponent {
  @Input() note: Note | null = null;
  @Output() save = new EventEmitter<Partial<Note>>();
  @Output() delete = new EventEmitter<void>();

  draft: { title: string; content: string } = { title: '', content: '' };

  ngOnChanges() {
    if (this.note) {
      this.draft = {
        title: this.note.title ?? '',
        content: this.note.content ?? ''
      };
    } else {
      this.draft = { title: '', content: '' };
    }
  }

  // PUBLIC_INTERFACE
  onSave() {
    if (!this.note) return;
    this.save.emit({
      title: this.draft.title.trim() || 'Untitled',
      content: this.draft.content
    });
  }

  // PUBLIC_INTERFACE
  onDelete() {
    if (!this.note) return;
    this.delete.emit();
  }
}
