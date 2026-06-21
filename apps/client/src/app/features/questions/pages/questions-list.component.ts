import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuestionsService } from '../../../core/services/questions.service';
import { ProgressService } from '../../../core/services/progress.service';
import { Question, UserProgress, QuestionCategory } from '../../../core/models/models';

const CATEGORY_META: Record<string, { label: string; icon: string; color: string; desc: string }> = {
  angular: { label: 'Angular', icon: '▲', color: '#DD0031', desc: 'Components, Directives, RxJS, Signals & more' },
  javascript: { label: 'JavaScript', icon: '⬡', color: '#F7DF1E', desc: 'Core JS, ES6+, Async, Closures, Prototypes' },
  'system-design': { label: 'System Design', icon: '◈', color: '#3B82F6', desc: 'Scalability, Caching, Microservices & more' },
};

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="qlist-page">
      <!-- Header -->
      <div class="qlist-header glass-panel" [style.border-left-color]="meta.color" [style.box-shadow]="'0 8px 32px ' + meta.color + '12'">
        <div class="qlist-header-icon" [style.color]="meta.color" [style.text-shadow]="'0 0 15px ' + meta.color">{{ meta.icon }}</div>
        <div>
          <h1 class="qlist-title">{{ meta.label }} Questions</h1>
          <p class="qlist-desc">{{ meta.desc }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <input
          id="search-questions"
          type="text"
          class="glass-input search-input"
          placeholder="Search questions..."
          [(ngModel)]="searchQuery"
          (ngModelChange)="applyFilters()"
        />
        <select id="filter-difficulty" class="glass-input filter-select" [(ngModel)]="selectedDifficulty" (ngModelChange)="applyFilters()">
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select id="filter-status" class="glass-input filter-select" [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()">
          <option value="">All Status</option>
          <option value="unseen">Unseen</option>
          <option value="reviewed">Reviewed</option>
          <option value="mastered">Mastered</option>
          <option value="bookmarked">Bookmarked</option>
        </select>
        <div class="filter-count">{{ filtered().length }} questions</div>
      </div>

      <!-- List -->
      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <span>Loading questions...</span>
        </div>
      } @else if (filtered().length === 0) {
        <div class="empty-state glass-panel">
          <div style="font-size:3rem; margin-bottom: 8px;">🔍</div>
          <p>No questions found. Try adjusting your filters.</p>
        </div>
      } @else {
        <div class="questions-list">
          @for (q of filtered(); track q._id) {
            <a
              [id]="'question-' + q._id"
              [routerLink]="['/questions', category(), q._id]"
              class="question-card glass-panel"
              [class.status-reviewed]="getStatus(q._id) === 'reviewed'"
              [class.status-mastered]="getStatus(q._id) === 'mastered'"
            >
              <div class="qcard-left">
                <div class="difficulty-badge" [class]="'diff-' + q.difficulty">
                  {{ q.difficulty }}
                </div>
                <div class="qcard-content">
                  <div class="qcard-title">{{ q.title }}</div>
                  <div class="qcard-topic">{{ q.topic }}</div>
                  @if (q.tags?.length) {
                    <div class="qcard-tags">
                      @for (tag of q.tags.slice(0,3); track tag) {
                        <span class="tag">{{ tag }}</span>
                      }
                    </div>
                  }
                </div>
              </div>
              <div class="qcard-right">
                @if (getStatus(q._id) === 'mastered') {
                  <span class="status-icon mastered glow-text-accent" title="Mastered">✓✓</span>
                } @else if (getStatus(q._id) === 'reviewed') {
                  <span class="status-icon reviewed glow-text-success" title="Reviewed">✓</span>
                }
                @if (isBookmarked(q._id)) {
                  <span class="bookmark-icon active" title="Bookmarked" style="color: var(--color-warning); text-shadow: 0 0 10px rgba(245, 158, 11, 0.4)">🔖</span>
                }
                <span class="arrow">→</span>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .qlist-page { padding:36px; max-width:960px; }
    .qlist-header { display:flex; align-items:center; gap:20px; margin-bottom:32px; padding: 24px; border-left:4px solid var(--color-accent); }
    .qlist-header-icon { font-size:2.5rem; }
    .qlist-title { font-size:1.75rem; font-weight:900; color:white; margin-bottom:4px; letter-spacing: -0.02em; }
    .qlist-desc { color:var(--color-text-muted); font-size:0.95rem; }

    .filters-bar { display:flex; gap:12px; align-items:center; margin-bottom:24px; flex-wrap:wrap; }
    .search-input { flex:1; min-width:240px; }
    .filter-select { cursor:pointer; }
    .filter-select option { background: #0b0b10; color: white; }
    .filter-count { font-size:0.85rem; font-weight: 600; color:var(--color-text-muted); white-space:nowrap; margin-left: 4px; }

    .questions-list { display:flex; flex-direction:column; gap:10px; }
    .question-card { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; text-decoration:none; cursor:pointer; }
    .question-card:hover { border-color:var(--color-accent); background:rgba(139,92,246,0.06); transform: translateY(-2px) translateX(4px); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(139,92,246,0.1); }
    .question-card.status-reviewed { border-left:4px solid var(--color-success); }
    .question-card.status-mastered { border-left:4px solid var(--color-accent-light); }
    .qcard-left { display:flex; align-items:flex-start; gap:16px; flex:1; min-width:0; }
    .qcard-content { flex:1; min-width:0; }
    .qcard-title { font-weight:700; font-size:1.05rem; color:white; margin-bottom:4px; letter-spacing: -0.01em; }
    .qcard-topic { font-size:0.8rem; font-weight: 500; color:var(--color-text-muted); margin-bottom:10px; text-transform: uppercase; letter-spacing: 0.05em; }
    .qcard-tags { display:flex; gap:6px; flex-wrap:wrap; }
    .tag { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:6px; padding:3px 10px; font-size:0.75rem; color:var(--color-text-muted); font-weight: 500; }

    .difficulty-badge { font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; padding:4px 10px; border-radius:6px; white-space:nowrap; flex-shrink:0; margin-top:2px; }
    .diff-beginner { background:rgba(16,185,129,0.12); border: 1px solid rgba(16, 185, 129, 0.2); color:var(--color-success); }
    .diff-intermediate { background:rgba(245,158,11,0.12); border: 1px solid rgba(245, 158, 11, 0.2); color:var(--color-warning); }
    .diff-advanced { background:rgba(239,68,68,0.12); border: 1px solid rgba(239, 68, 68, 0.2); color:var(--color-danger); }

    .qcard-right { display:flex; align-items:center; gap:14px; flex-shrink:0; margin-left:16px; }
    .status-icon { font-size:0.95rem; font-weight:900; }
    .bookmark-icon { font-size:1.05rem; }
    .arrow { color:var(--color-text-muted); font-size:1.1rem; transition:transform 0.25s, color 0.25s; }
    .question-card:hover .arrow { transform:translateX(4px); color: white; }

    .loading-state { display:flex; align-items:center; gap:12px; color:var(--color-text-muted); padding:60px; justify-content:center; }
    .spinner { width:22px; height:22px; border:2px solid var(--color-border); border-top-color:var(--color-accent-light); border-radius:50%; animation:spin 0.7s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .empty-state { text-align:center; padding:60px; color:var(--color-text-muted); display:flex; flex-direction:column; align-items:center; gap:12px; }

    @media (max-width: 768px) {
      .qlist-page { padding: 20px; }
      .qlist-header { border-left-width: 3px; padding: 16px; }
      .filters-bar { flex-direction: column; align-items: stretch; gap: 10px; }
      .search-input { width: 100%; }
      .question-card { padding: 16px; }
      .qcard-left { gap: 12px; }
    }
  `],
})
export class QuestionsListComponent implements OnInit {
  questions = signal<Question[]>([]);
  progressMap = signal<Map<string, UserProgress>>(new Map());
  loading = signal(true);
  searchQuery = '';
  selectedDifficulty = '';
  selectedStatus = '';

  category = signal<QuestionCategory>('angular');

  filtered = computed(() => {
    let list = this.questions();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((q2) => q2.title.toLowerCase().includes(q) || q2.topic.toLowerCase().includes(q));
    }
    if (this.selectedDifficulty) list = list.filter((q) => q.difficulty === this.selectedDifficulty);
    if (this.selectedStatus === 'bookmarked') list = list.filter((q) => this.isBookmarked(q._id));
    else if (this.selectedStatus) list = list.filter((q) => this.getStatus(q._id) === this.selectedStatus);
    return list;
  });

  get meta() {
    return CATEGORY_META[this.category()] || CATEGORY_META['angular'];
  }

  getStatus(qId: string): string {
    return this.progressMap().get(qId)?.status ?? 'unseen';
  }

  isBookmarked(qId: string): boolean {
    return this.progressMap().get(qId)?.bookmarked ?? false;
  }

  applyFilters() {}

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService,
    private progressService: ProgressService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.category.set(p['category'] as QuestionCategory);
      this.loadData();
    });
  }

  loadData() {
    this.loading.set(true);
    this.questionsService.getAll({ category: this.category() }).subscribe({
      next: (qs) => {
        this.questions.set(qs);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.progressService.getAll().subscribe({
      next: (progress) => {
        const map = new Map(progress.map((p) => [p.questionId, p]));
        this.progressMap.set(map);
      },
    });
  }
}
