import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Note } from '../models/note.model';

/**
 * NotesService handles CRUD operations against the backend API and maintains
 * a client-side observable store of notes for the UI to subscribe to.
 */
@Injectable({ providedIn: 'root' })
export class NotesService {
  private http = inject(HttpClient);

  // Base API URL: must be set via environment variable at build/deploy time.
  // PUBLIC_INTERFACE
  /** Get the backend API base URL used by the NotesService. */
  get apiBaseUrl(): string {
    // IMPORTANT: The orchestrator should set NOTES_API_BASE_URL in .env before build.
    // Avoid direct 'window' reference in SSR/lint by using globalThis guarded access.
    const w = (globalThis as any);
    return w && w.__env__ && w.__env__.NOTES_API_BASE_URL ? w.__env__.NOTES_API_BASE_URL : '/api';
  }

  private notes$ = new BehaviorSubject<Note[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private selectedNoteId$ = new BehaviorSubject<string | null>(null);

  /** Observable list of notes for components to subscribe to. */
  // PUBLIC_INTERFACE
  get notesObservable(): Observable<Note[]> {
    return this.notes$.asObservable();
  }

  /** Observable loading state. */
  // PUBLIC_INTERFACE
  get loadingObservable(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  /** Observable of the currently selected note. */
  // PUBLIC_INTERFACE
  get selectedNoteObservable(): Observable<Note | null> {
    return this.selectedNoteId$.pipe(
      map(id => {
        if (!id) return null;
        return this.notes$.getValue().find(n => n.id === id) ?? null;
      })
    );
  }

  // PUBLIC_INTERFACE
  /** Load all notes from the backend. */
  loadNotes(): Observable<Note[]> {
    this.loading$.next(true);
    return this.http.get<Note[]>(`${this.apiBaseUrl}/notes`).pipe(
      tap({
        next: (notes) => {
          // Sort by updatedAt desc by default
          const sorted = [...notes].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
          this.notes$.next(sorted);
          this.loading$.next(false);
        },
        error: () => this.loading$.next(false)
      })
    );
  }

  // PUBLIC_INTERFACE
  /** Create a new note with title and optional content. */
  createNote(payload: Partial<Note> & { title: string }): Observable<Note> {
    return this.http.post<Note>(`${this.apiBaseUrl}/notes`, payload).pipe(
      tap((note) => {
        const list = [note, ...this.notes$.getValue()];
        this.notes$.next(list);
        this.selectedNoteId$.next(note.id);
      })
    );
  }

  // PUBLIC_INTERFACE
  /** Update a note by id with changed fields. */
  updateNote(id: string, patch: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.apiBaseUrl}/notes/${id}`, patch).pipe(
      tap((updated) => {
        const list = this.notes$.getValue().map(n => (n.id === id ? updated : n));
        // keep list sorted by updatedAt desc
        list.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
        this.notes$.next(list);
      })
    );
  }

  // PUBLIC_INTERFACE
  /** Delete a note by id. */
  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/notes/${id}`).pipe(
      tap(() => {
        const list = this.notes$.getValue().filter(n => n.id !== id);
        this.notes$.next(list);
        if (this.selectedNoteId$.getValue() === id) {
          this.selectedNoteId$.next(list.length ? list[0].id : null);
        }
      })
    );
  }

  // PUBLIC_INTERFACE
  /** Select a note by id to view/edit. */
  selectNote(id: string | null): void {
    this.selectedNoteId$.next(id);
  }

  // PUBLIC_INTERFACE
  /** Get current snapshot of notes. */
  getNotesSnapshot(): Note[] {
    return this.notes$.getValue();
  }

  // PUBLIC_INTERFACE
  /** Get selected note id snapshot. */
  getSelectedNoteId(): string | null {
    return this.selectedNoteId$.getValue();
  }
}
