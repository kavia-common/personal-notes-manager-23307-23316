import { Routes } from '@angular/router';
import { NotesPageComponent } from './pages/notes-page/notes-page.component';

export const routes: Routes = [
  { path: '', component: NotesPageComponent },
  { path: '**', redirectTo: '' }
];
