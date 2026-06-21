import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, CreateQuestionPayload } from '../services/admin.service';
import { Question } from '../../../core/models/models';

const EMPTY_FORM = (): CreateQuestionPayload => ({
  category: 'angular',
  topic: '',
  title: '',
  description: '',
  answer: '',
  codeSnippet: '',
  difficulty: 'beginner',
  tags: [],
  order: 0,
});

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <!-- Header -->
      <div class="admin-header">
        <div>
          <h1 class="admin-title">⚙ Admin Panel</h1>
          <p class="admin-sub">Manage interview questions — {{ questions().length }} total</p>
        </div>
        <button id="btn-add-question" class="btn-premium" (click)="openCreate()">+ Add Question</button>
      </div>

      <!-- Filters -->
      <div class="admin-filters">
        <select id="admin-filter-cat" class="glass-input filter-select" [(ngModel)]="filterCategory" (ngModelChange)="loadQuestions()">
          <option value="">All Categories</option>
          <option value="angular">Angular</option>
          <option value="javascript">JavaScript</option>
          <option value="system-design">System Design</option>
        </select>
        <select id="admin-filter-diff" class="glass-input filter-select" [(ngModel)]="filterDifficulty" (ngModelChange)="loadQuestions()">
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <input
          id="admin-search"
          type="text"
          class="glass-input filter-input"
          placeholder="Search by title..."
          [(ngModel)]="searchText"
        />
        <span class="result-count">{{ filteredQuestions().length }} shown</span>
      </div>

      <!-- Table -->
      <div class="admin-table-wrap glass-panel">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Topic</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (q of filteredQuestions(); track q._id) {
              <tr>
                <td><span class="cat-badge" [class]="'cat-' + q.category">{{ q.category }}</span></td>
                <td class="topic-cell">{{ q.topic }}</td>
                <td class="title-cell">{{ q.title }}</td>
                <td><span class="diff-badge" [class]="'diff-' + q.difficulty">{{ q.difficulty }}</span></td>
                <td class="actions-cell">
                  <button [id]="'btn-edit-' + q._id" class="btn-edit" (click)="openEdit(q)">✎ Edit</button>
                  <button [id]="'btn-delete-' + q._id" class="btn-del" (click)="confirmDelete(q)">🗑</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal glass-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2 class="modal-title">{{ editingId() ? 'Edit Question' : 'Add Question' }}</h2>
              <button class="modal-close" (click)="closeModal()">✕</button>
            </div>

            <div class="modal-body">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Category *</label>
                  <select id="form-category" class="glass-input form-select" [(ngModel)]="form.category">
                    <option value="angular">Angular</option>
                    <option value="javascript">JavaScript</option>
                    <option value="system-design">System Design</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Difficulty *</label>
                  <select id="form-difficulty" class="glass-input form-select" [(ngModel)]="form.difficulty">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Topic *</label>
                  <input id="form-topic" type="text" class="glass-input form-input" [(ngModel)]="form.topic" placeholder="e.g. Components, Closures" />
                </div>
                <div class="form-group">
                  <label class="form-label">Order</label>
                  <input id="form-order" type="number" class="glass-input form-input" [(ngModel)]="form.order" placeholder="0" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Title *</label>
                <input id="form-title" type="text" class="glass-input form-input" [(ngModel)]="form.title" placeholder="What is...?" />
              </div>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea id="form-description" class="glass-input form-textarea" [(ngModel)]="form.description" placeholder="Context or sub-question..." rows="2"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Answer *</label>
                <textarea id="form-answer" class="glass-input form-textarea" [(ngModel)]="form.answer" placeholder="Detailed answer..." rows="6"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Code Snippet</label>
                <textarea id="form-code" class="glass-input form-textarea code-input" [(ngModel)]="form.codeSnippet" placeholder="Optional code example..." rows="5"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Tags (comma separated)</label>
                <input id="form-tags" type="text" class="glass-input form-input" [(ngModel)]="tagsInput" placeholder="rxjs, observables, async" />
              </div>

              @if (formError()) {
                <div class="form-error">{{ formError() }}</div>
              }
            </div>

            <div class="modal-footer">
              <button id="btn-cancel-modal" class="btn-cancel" (click)="closeModal()">Cancel</button>
              <button id="btn-save-question" class="btn-premium btn-save" (click)="save()" [disabled]="saving()">
                {{ saving() ? 'Saving...' : editingId() ? 'Update Question' : 'Add Question' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Delete confirm -->
      @if (deleteTarget()) {
        <div class="modal-overlay" (click)="deleteTarget.set(null)">
          <div class="confirm-modal glass-panel" (click)="$event.stopPropagation()">
            <div class="confirm-icon">🗑</div>
            <h3 class="confirm-title">Delete Question?</h3>
            <p class="confirm-msg">{{ deleteTarget()!.title }}</p>
            <p class="confirm-sub">This action cannot be undone.</p>
            <div class="confirm-actions">
              <button id="btn-cancel-delete" class="btn-cancel" (click)="deleteTarget.set(null)">Cancel</button>
              <button id="btn-confirm-delete" class="btn-del-confirm" (click)="deleteQuestion()">Delete</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 40px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .admin-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--color-text);
      letter-spacing: -0.025em;
      text-shadow: 0 0 30px rgba(139, 92, 246, 0.15);
    }
    .admin-sub {
      color: var(--color-text-muted);
      font-size: 0.95rem;
      margin-top: 4px;
    }

    .admin-filters {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .filter-select {
      cursor: pointer;
    }
    .filter-input {
      flex: 1;
      min-width: 250px;
    }
    .result-count {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      font-weight: 500;
      background: rgba(255, 255, 255, 0.04);
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.03);
      white-space: nowrap;
      margin-left: auto;
    }

    .admin-table-wrap {
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .admin-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      text-align: left;
    }
    .admin-table th {
      background: rgba(255, 255, 255, 0.02);
      padding: 16px 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-text-muted);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .admin-table td {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
      color: var(--color-text);
      font-size: 0.9rem;
    }
    .admin-table tr:last-child td {
      border-bottom: none;
    }
    .admin-table tr {
      transition: background-color 0.2s ease;
    }
    .admin-table tr:hover td {
      background: rgba(255, 255, 255, 0.015);
    }
    .topic-cell {
      color: var(--color-text-muted);
      font-weight: 500;
    }
    .title-cell {
      font-weight: 600;
      color: var(--color-text);
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .actions-cell {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .cat-badge {
      font-size: 0.725rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
      letter-spacing: 0.03em;
    }
    .cat-angular {
      background: rgba(255, 62, 108, 0.08);
      border: 1px solid rgba(255, 62, 108, 0.2);
      color: var(--color-angular);
      text-shadow: 0 0 10px rgba(255, 62, 108, 0.2);
    }
    .cat-javascript {
      background: rgba(247, 223, 30, 0.06);
      border: 1px solid rgba(247, 223, 30, 0.15);
      color: var(--color-js);
      text-shadow: 0 0 10px rgba(247, 223, 30, 0.15);
    }
    .cat-system-design {
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.2);
      color: var(--color-system);
      text-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
    }

    .diff-badge {
      font-size: 0.725rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
      letter-spacing: 0.03em;
    }
    .diff-beginner {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: var(--color-success);
      text-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
    }
    .diff-intermediate {
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.2);
      color: var(--color-warning);
      text-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
    }
    .diff-advanced {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: var(--color-danger);
      text-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
    }

    .btn-edit {
      background: rgba(139, 92, 246, 0.08);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-accent-light);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
    }
    .btn-edit:hover {
      background: rgba(139, 92, 246, 0.18);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
    }
    .btn-del {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 0.85rem;
      color: var(--color-danger);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .btn-del:hover {
      background: rgba(239, 68, 68, 0.18);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
    }

    /* Modal Overlay & Card styling */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(3, 3, 5, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal {
      width: 100%;
      max-width: 720px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      background: rgba(12, 12, 20, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .modal-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-text);
      letter-spacing: -0.01em;
    }
    .modal-close {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: var(--color-text-muted);
      font-size: 0.9rem;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }
    .modal-close:hover {
      color: var(--color-text);
      background: rgba(255, 255, 255, 0.08);
      transform: rotate(90deg);
    }
    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 28px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.01);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .form-label {
      font-size: 0.725rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-text-muted);
    }
    .form-select, .form-textarea {
      width: 100%;
    }
    .form-textarea {
      resize: vertical;
      line-height: 1.6;
    }
    .code-input {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
    }
    .form-error {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 10px;
      padding: 12px 16px;
      color: var(--color-danger);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .btn-cancel {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px 24px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }
    .btn-save {
      margin-left: 4px;
    }

    /* Confirm delete modal */
    .confirm-modal {
      background: rgba(15, 15, 25, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
      padding: 40px;
      width: 100%;
      max-width: 440px;
      text-align: center;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .confirm-icon {
      font-size: 3rem;
      margin-bottom: 16px;
      filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.3));
    }
    .confirm-title {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--color-text);
      margin-bottom: 8px;
    }
    .confirm-msg {
      color: var(--color-text-muted);
      font-size: 0.95rem;
      margin-bottom: 6px;
      font-weight: 600;
      word-break: break-word;
    }
    .confirm-sub {
      color: rgba(239, 68, 68, 0.7);
      font-size: 0.825rem;
      margin-bottom: 28px;
      font-weight: 500;
    }
    .confirm-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .btn-del-confirm {
      background: linear-gradient(135deg, var(--color-danger), #B91C1C);
      color: white;
      border: none;
      border-radius: 10px;
      padding: 12px 24px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
      transition: all 0.2s ease;
    }
    .btn-del-confirm:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.5);
      filter: brightness(1.1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .admin-page { padding: 20px; }
      .admin-header { flex-direction: column; gap: 16px; align-items: stretch; }
      .admin-filters { flex-direction: column; align-items: stretch; gap: 12px; }
      .filter-input { width: 100%; }
      .result-count { margin-left: 0; text-align: right; }
      .form-row { grid-template-columns: 1fr; gap: 16px; }
      .modal { width: calc(100% - 24px); max-height: 95vh; }
      .modal-body { padding: 20px; gap: 16px; }
      .modal-footer { padding: 16px 20px; }
    }
  `],
})
export class AdminComponent implements OnInit {
  questions = signal<Question[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  saving = signal(false);
  formError = signal('');
  deleteTarget = signal<Question | null>(null);

  filterCategory = '';
  filterDifficulty = '';
  searchText = '';
  tagsInput = '';
  form: CreateQuestionPayload = EMPTY_FORM();

  filteredQuestions = () => {
    let list = this.questions();
    if (this.filterCategory) list = list.filter(q => q.category === this.filterCategory);
    if (this.filterDifficulty) list = list.filter(q => q.difficulty === this.filterDifficulty);
    if (this.searchText) {
      const s = this.searchText.toLowerCase();
      list = list.filter(q => q.title.toLowerCase().includes(s));
    }
    return list;
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.loadQuestions(); }

  loadQuestions() {
    const params: any = {};
    if (this.filterCategory) params.category = this.filterCategory;
    if (this.filterDifficulty) params.difficulty = this.filterDifficulty;
    this.adminService.getAll(params).subscribe({ next: q => this.questions.set(q) });
  }

  openCreate() {
    this.form = EMPTY_FORM();
    this.tagsInput = '';
    this.editingId.set(null);
    this.formError.set('');
    this.showModal.set(true);
  }

  openEdit(q: Question) {
    this.form = {
      category: q.category,
      topic: q.topic,
      title: q.title,
      description: q.description,
      answer: q.answer,
      codeSnippet: q.codeSnippet,
      difficulty: q.difficulty,
      tags: q.tags,
    };
    this.tagsInput = q.tags?.join(', ') ?? '';
    this.editingId.set(q._id);
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.form.title || !this.form.answer || !this.form.topic) {
      this.formError.set('Title, Topic, and Answer are required.');
      return;
    }

    this.form.tags = this.tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    this.saving.set(true);
    this.formError.set('');

    const id = this.editingId();
    const obs = id
      ? this.adminService.update(id, this.form)
      : this.adminService.create(this.form);

    obs.subscribe({
      next: (q) => {
        if (id) {
          this.questions.update(list => list.map(item => item._id === id ? q : item));
        } else {
          this.questions.update(list => [q, ...list]);
        }
        this.saving.set(false);
        this.closeModal();
      },
      error: (err) => {
        this.formError.set(err.error?.message || 'Failed to save question.');
        this.saving.set(false);
      },
    });
  }

  confirmDelete(q: Question) { this.deleteTarget.set(q); }

  deleteQuestion() {
    const q = this.deleteTarget();
    if (!q) return;
    this.adminService.delete(q._id).subscribe({
      next: () => {
        this.questions.update(list => list.filter(item => item._id !== q._id));
        this.deleteTarget.set(null);
      },
    });
  }
}
