import { Component, computed, effect, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NoteListComponent } from '../../components/note-list/note-list.component';
import { NoteDetailComponent } from '../../components/note-detail/note-detail.component';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';


/**
 * NotesPageComponent is the main screen that includes sidebar, topbar,
 * note list, and note detail. It orchestrates data flow and UI events.
 */
@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    NoteListComponent,
    NoteDetailComponent
  ],
  templateUrl: './notes-page.component.html',
  styleUrl: './notes-page.component.css'
})
export class NotesPageComponent {
  private notesSvc = inject(NotesService);
  private platformId = inject(PLATFORM_ID);

  notes = signal<Note[]>([]);
  filteredNotes = signal<Note[]>([]);
  selectedId = signal<string | null>(null);
  loading = signal<boolean>(false);

  constructor() {
    // Subscribe data from service to signals
    this.notesSvc.notesObservable.subscribe((list) => {
      this.notes.set(list);
      this.filteredNotes.set(list);
      // Ensure selected id exists
      const cur = this.notesSvc.getSelectedNoteId();
      if (!cur && list.length) {
        this.onSelect(list[0].id);
      }
    });

    this.notesSvc.loadingObservable.subscribe((l) => this.loading.set(l));

    this.notesSvc.selectedNoteObservable.subscribe((n) => {
      this.selectedId.set(n?.id ?? null);
    });
  }

  ngOnInit() {
    // Avoid making HTTP calls during SSR/prerender to prevent build-time failures.
    if (!isPlatformServer(this.platformId)) {
      this.notesSvc.loadNotes().subscribe();
    }
  }

  // PUBLIC_INTERFACE
  onCreate() {
    this.notesSvc.createNote({ title: 'New note', content: '' }).subscribe();
  }

  // PUBLIC_INTERFACE
  onSearch(term: string) {
    const t = term.toLowerCase();
    const list = this.notes().filter(n =>
      (n.title || '').toLowerCase().includes(t) ||
      (n.content || '').toLowerCase().includes(t) ||
      (n.tags || []).some(tag => tag.toLowerCase().includes(t))
    );
    this.filteredNotes.set(list);
  }

  // PUBLIC_INTERFACE
  onSelect(id: string) {
    this.notesSvc.selectNote(id);
  }

  // PUBLIC_INTERFACE
  onSave(patch: Partial<Note>) {
    const id = this.selectedId();
    if (!id) return;
    this.notesSvc.updateNote(id, patch).subscribe();
  }

  // PUBLIC_INTERFACE
  onDelete() {
    const id = this.selectedId();
    if (!id) return;
    this.notesSvc.deleteNote(id).subscribe();
  }

  get selectedNote(): Note | null {
    const id = this.selectedId();
    if (!id) return null;
    return this.notes().find(n => n.id === id) ?? null;
  }
}
