import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockTestsApiService } from '../services/mock-tests-api.service';
import { MockTest } from '../../../core/models/models';

@Component({
  selector: 'app-mock-tests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mt-page">
      <div class="mt-header">
        <h1 class="mt-title">Mock Tests</h1>
        <p class="mt-sub">Simulate real interview conditions with timed tests</p>
      </div>

      <!-- Config card -->
      <div class="config-card glass-panel">
        <h2 class="config-title">Configure Your Test</h2>
        <div class="config-grid">
          <div class="config-group">
            <label class="config-label">Category</label>
            <div class="option-pills">
              @for (cat of categories; track cat.value) {
                <button
                  [id]="'cat-' + cat.value"
                  class="pill"
                  [class.active]="selectedCategory === cat.value"
                  (click)="selectedCategory = cat.value"
                  [style.--pill-color]="cat.color"
                >
                  {{ cat.icon }} {{ cat.label }}
                </button>
              }
            </div>
          </div>

          <div class="config-group">
            <label class="config-label">Difficulty</label>
            <div class="option-pills">
              @for (d of difficulties; track d.value) {
                <button
                  [id]="'diff-' + d.value"
                  class="pill"
                  [class.active]="selectedDifficulty === d.value"
                  (click)="selectedDifficulty = d.value"
                >
                  {{ d.label }}
                </button>
              }
            </div>
          </div>

          <div class="config-group">
            <label class="config-label">Duration</label>
            <div class="option-pills">
              @for (dur of durations; track dur) {
                <button
                  [id]="'dur-' + dur"
                  class="pill"
                  [class.active]="selectedDuration === dur"
                  (click)="selectedDuration = dur"
                >
                  {{ dur }} min
                </button>
              }
            </div>
          </div>

          <div class="config-group">
            <label class="config-label">Questions: {{ questionCount }}</label>
            <input
              id="question-count"
              type="range"
              min="5" max="30" step="5"
              [(ngModel)]="questionCount"
              class="range-input"
            />
          </div>
        </div>

        <button id="btn-start-test" class="btn-premium btn-start" (click)="startTest()" [disabled]="loading()">
          @if (loading()) { Starting... } @else { ⏱ Start Test }
        </button>
      </div>

      <!-- History -->
      <div class="section-title">Recent Tests</div>
      @if (history().length === 0) {
        <div class="empty-history glass-panel">No tests completed yet. Start your first test above!</div>
      } @else {
        <div class="history-list">
          @for (test of history(); track test._id) {
            <div class="history-card glass-panel">
              <div class="hcard-left">
                <div class="hcard-cat">{{ test.category }}</div>
                <div class="hcard-score" [class]="getScoreClass(test)">{{ getPercent(test) }}%</div>
                <div class="hcard-detail">{{ test.score }}/{{ test.totalQuestions }} correct · {{ test.durationMinutes }}min</div>
              </div>
              <div class="hbar-wrap">
                <div class="hcard-bar">
                  <div class="hbar-fill" [style.width.%]="getPercent(test)" [class]="getScoreClass(test)"></div>
                </div>
              </div>
              <div class="hcard-date">{{ test.completedAt | date:'MMM d, y' }}</div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .mt-page { padding:36px; max-width:960px; }
    .mt-header { margin-bottom:32px; }
    .mt-title { font-size:2rem; font-weight:900; color:white; margin-bottom:4px; letter-spacing: -0.02em; }
    .mt-sub { color:var(--color-text-muted); font-size:0.95rem; }

    .config-card { padding:28px; margin-bottom:36px; }
    .config-title { font-size:1.15rem; font-weight:800; color:white; margin-bottom:24px; letter-spacing: -0.01em; }
    .config-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:28px; }
    .config-group { display:flex; flex-direction:column; gap:10px; }
    .config-label { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); }
    .option-pills { display:flex; gap:8px; flex-wrap:wrap; }
    .pill { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:8px; padding:8px 14px; font-size:0.85rem; font-weight:600; color:var(--color-text-muted); cursor:pointer; transition:all 0.2s; }
    .pill:hover { border-color:var(--color-accent-light); color:white; }
    .pill.active { background:rgba(139,92,246,0.08); border-color:var(--color-accent-light); color:white; font-weight:700; box-shadow: 0 0 10px rgba(167, 139, 250, 0.2); }
    
    .range-input { width:100%; accent-color:var(--color-accent); cursor: pointer; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.05); }
    .btn-start { width: 100%; padding: 14px; font-size: 1rem; font-weight: 700; }

    .section-title { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-text-muted); margin-bottom:16px; padding-left: 2px; }
    .empty-history { color:var(--color-text-muted); font-size:0.9rem; padding:32px; text-align: center; }
    
    .history-list { display:flex; flex-direction:column; gap:10px; }
    .history-card { padding:18px 24px; display:grid; grid-template-columns:140px 1fr 100px; gap:20px; align-items:center; }
    .hcard-left { display:flex; flex-direction:column; gap:4px; }
    .hcard-cat { font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-text-muted); }
    
    .hcard-score { font-size:1.75rem; font-weight:900; letter-spacing: -0.02em; }
    .hcard-score.score-high { color: var(--color-success); text-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
    .hcard-score.score-mid { color: var(--color-warning); text-shadow: 0 0 10px rgba(245, 158, 11, 0.2); }
    .hcard-score.score-low { color: var(--color-danger); text-shadow: 0 0 10px rgba(239, 68, 68, 0.2); }
    
    .hcard-detail { font-size:0.75rem; font-weight: 500; color:var(--color-text-muted); }
    .hbar-wrap { display: flex; align-items: center; }
    .hcard-bar { flex:1; height:8px; background:rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.03); border-radius:4px; overflow:hidden; }
    .hbar-fill { height:100%; border-radius:4px; transition:width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
    
    .hbar-fill.score-high { background:var(--color-success); box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
    .hbar-fill.score-mid { background:var(--color-warning); box-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }
    .hbar-fill.score-low { background:var(--color-danger); box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
    
    .hcard-date { font-size:0.8rem; font-weight: 600; color:var(--color-text-muted); text-align: right; }

    @media (max-width: 768px) {
      .config-grid { grid-template-columns: 1fr; gap: 16px; }
      .history-card { grid-template-columns: 1fr; gap: 12px; }
      .hcard-date { text-align: left; }
    }
  `],
})
export class MockTestsComponent {
  categories = [
    { value: 'angular', label: 'Angular', icon: '▲', color: '#DD0031' },
    { value: 'javascript', label: 'JavaScript', icon: '⬡', color: '#F7DF1E' },
    { value: 'system-design', label: 'System Design', icon: '◈', color: '#3B82F6' },
    { value: 'mixed', label: 'Mixed', icon: '⊞', color: '#7C3AED' },
  ];
  difficulties = [
    { value: 'beginner', label: '🟢 Beginner' },
    { value: 'intermediate', label: '🟡 Intermediate' },
    { value: 'advanced', label: '🔴 Advanced' },
    { value: 'mixed', label: '🎲 Mixed' },
  ];
  durations = [15, 30, 60];

  selectedCategory = 'angular';
  selectedDifficulty = 'mixed';
  selectedDuration = 30;
  questionCount = 10;
  loading = signal(false);
  history = signal<MockTest[]>([]);

  constructor(private mockTestsApi: MockTestsApiService, private router: Router) {
    this.mockTestsApi.getHistory().subscribe({ next: (h) => this.history.set(h) });
  }

  startTest() {
    this.loading.set(true);
    this.mockTestsApi.start(this.selectedCategory, this.selectedDifficulty, this.selectedDuration, this.questionCount).subscribe({
      next: (test) => this.router.navigate(['/mock-tests', test._id]),
      error: () => this.loading.set(false),
    });
  }

  getPercent(test: MockTest): number {
    return test.totalQuestions > 0 ? Math.round((test.score / test.totalQuestions) * 100) : 0;
  }

  getScoreClass(test: MockTest): string {
    const p = this.getPercent(test);
    if (p >= 70) return 'score-high';
    if (p >= 40) return 'score-mid';
    return 'score-low';
  }
}
