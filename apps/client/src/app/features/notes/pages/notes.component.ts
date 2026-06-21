import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesApiService } from '../services/notes-api.service';
import { Note } from '../../../core/models/models';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notes-page">
      <div class="notes-sidebar">
        <div class="notes-header">
          <h1 class="notes-title">My Notes</h1>
          <button id="btn-new-note" class="btn-new" (click)="newNote()">+ New</button>
        </div>
        <input
          id="search-notes"
          type="text"
          class="glass-input notes-search"
          placeholder="Search notes..."
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearch()"
        />
        <div class="notes-list">
          @for (note of notes(); track note._id) {
            <div
              [id]="'note-' + note._id"
              class="note-item"
              [class.active]="selectedNote()?._id === note._id"
              (click)="selectNote(note)"
            >
              <div class="note-item-title">{{ note.title || 'Untitled' }}</div>
              <div class="note-item-preview">{{ note.content | slice:0:80 }}</div>
              <div class="note-item-date">{{ note.updatedAt | date:'MMM d' }}</div>
            </div>
          } @empty {
            <div class="empty-notes">No notes yet. Create your first one!</div>
          }
        </div>
      </div>

      <div class="notes-editor">
        @if (selectedNote()) {
          <div class="editor-toolbar">
            <input
              id="note-title-input"
              type="text"
              class="note-title-input"
              [(ngModel)]="editTitle"
              (ngModelChange)="onTitleChange()"
              placeholder="Note title..."
            />
            <div class="toolbar-actions">
              <span class="save-indicator" [class.saved]="saved()">{{ saved() ? '✓ Saved' : 'Saving...' }}</span>
              <button id="btn-delete-note" class="btn-delete" (click)="deleteNote()">🗑 Delete</button>
            </div>
          </div>
          <textarea
            id="note-content-editor"
            class="note-editor"
            [(ngModel)]="editContent"
            (ngModelChange)="onContentChange()"
            placeholder="Write your notes here... (Markdown supported)"
          ></textarea>
        } @else {
          <div class="editor-empty">
            <div style="font-size:3rem; margin-bottom: 8px;">✎</div>
            <h3>Select a note or create a new one</h3>
            <p>Your notes are auto-saved as you type</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .notes-page { display:flex; height:100vh; background: transparent; }
    .notes-sidebar { width:280px; flex-shrink:0; background:rgba(6, 6, 10, 0.4); border-right:1px solid rgba(255, 255, 255, 0.04); display:flex; flex-direction:column; backdrop-filter: blur(20px); }
    .notes-header { display:flex; align-items:center; justify-content:space-between; padding:20px 16px; border-bottom:1px solid rgba(255, 255, 255, 0.04); }
    .notes-title { font-size:1.15rem; font-weight:800; color:white; letter-spacing: -0.01em; }
    .btn-new { background:var(--color-accent); color:white; border:none; border-radius:8px; padding:6px 14px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.2); }
    .btn-new:hover { opacity:0.9; transform: translateY(-1px); box-shadow: 0 6px 15px rgba(139, 92, 246, 0.3); }
    .notes-search { margin:14px; font-size:0.85rem; }
    .notes-list { flex:1; overflow-y:auto; padding: 4px; display: flex; flex-direction: column; gap: 4px; }
    .note-item { padding:14px 16px; border-radius: 8px; cursor:pointer; transition:all 0.2s; border: 1px solid transparent; }
    .note-item:hover { background: rgba(255, 255, 255, 0.02); }
    .note-item.active { background:rgba(139,92,246,0.08); border: 1px solid rgba(139, 92, 246, 0.15); border-left: 4px solid var(--color-accent-light); }
    .note-item-title { font-weight:700; font-size:0.9rem; color:white; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .note-item-preview { font-size:0.75rem; color:var(--color-text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:6px; }
    .note-item-date { font-size:0.7rem; color:rgba(255, 255, 255, 0.2); font-weight: 500; }
    .empty-notes { padding:32px 16px; text-align:center; color:var(--color-text-muted); font-size:0.875rem; }

    .notes-editor { flex:1; display:flex; flex-direction:column; background: transparent; }
    .editor-toolbar { display:flex; align-items:center; gap:12px; padding:16px 24px; border-bottom:1px solid rgba(255, 255, 255, 0.04); background:rgba(6, 6, 10, 0.25); backdrop-filter: blur(10px); }
    .note-title-input { flex:1; background:none; border:none; outline:none; font-size:1.2rem; font-weight:800; color:white; letter-spacing: -0.01em; }
    .note-title-input::placeholder { color:rgba(255, 255, 255, 0.15); }
    .toolbar-actions { display:flex; align-items:center; gap:14px; }
    .save-indicator { font-size:0.75rem; font-weight: 600; color:var(--color-text-muted); transition:color 0.3s; }
    .save-indicator.saved { color:var(--color-success); text-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
    .btn-delete { background:rgba(239, 68, 68, 0.05); border:1px solid rgba(239, 68, 68, 0.15); border-radius:8px; padding:6px 12px; font-size:0.8rem; color:var(--color-danger); font-weight: 600; cursor:pointer; transition:all 0.2s; }
    .btn-delete:hover { border-color:var(--color-danger); background: rgba(239, 68, 68, 0.12); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15); }
    .note-editor { flex:1; background: transparent; border:none; outline:none; padding:28px 32px; color:var(--color-text); font-size:0.975rem; line-height:1.8; resize:none; font-family:var(--font-family-sans); }
    .editor-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:var(--color-text-muted); text-align:center; }
    .editor-empty h3 { font-size:1.15rem; font-weight:700; color: white; }
    .editor-empty p { font-size:0.875rem; }
  `],
})
export class NotesComponent implements OnInit, OnDestroy {
  notes = signal<Note[]>([]);
  selectedNote = signal<Note | null>(null);
  editTitle = '';
  editContent = '';
  saved = signal(true);
  searchQuery = '';

  private destroy$ = new Subject<void>();
  private saveSubject = new Subject<void>();

  constructor(private notesApi: NotesApiService) {}

  ngOnInit() {
    this.loadNotes();
    this.saveSubject.pipe(debounceTime(800), takeUntil(this.destroy$)).subscribe(() => this.save());
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadNotes(search?: string) {
    this.notesApi.getAll(search).subscribe({ next: (n) => this.notes.set(n) });
  }

  selectNote(note: Note) {
    this.selectedNote.set(note);
    this.editTitle = note.title;
    this.editContent = note.content;
    this.saved.set(true);
  }

  newNote() {
    this.notesApi.create('New Note', '').subscribe({
      next: (n) => {
        this.notes.update((list) => [n, ...list]);
        this.selectNote(n);
      },
    });
  }

  deleteNote() {
    const id = this.selectedNote()?._id;
    if (!id) return;
    this.notesApi.delete(id).subscribe({
      next: () => {
        this.notes.update((list) => list.filter((n) => n._id !== id));
        this.selectedNote.set(null);
      },
    });
  }

  onTitleChange() { this.saved.set(false); this.saveSubject.next(); }
  onContentChange() { this.saved.set(false); this.saveSubject.next(); }
  onSearch() { this.loadNotes(this.searchQuery); }

  save() {
    const id = this.selectedNote()?._id;
    if (!id) return;
    this.notesApi.update(id, this.editTitle, this.editContent).subscribe({
      next: (updated) => {
        this.notes.update((list) => list.map((n) => (n._id === id ? updated : n)));
        this.saved.set(true);
      },
    });
  }
}
