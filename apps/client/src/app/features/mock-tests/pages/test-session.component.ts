import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MockTest, Question } from '../../../core/models/models';
import { MockTestsApiService } from '../services/mock-tests-api.service';

@Component({
  selector: 'app-test-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="session-page">
      @if (completed()) {
        <!-- Results -->
        <div class="results-card glass-panel">
          <div class="results-icon">{{ scorePercent() >= 70 ? '🎉' : scorePercent() >= 40 ? '📈' : '💪' }}</div>
          <h1 class="results-title">Test Complete!</h1>
          <div class="results-score" [class]="scoreClass()">{{ scorePercent() }}%</div>
          <p class="results-sub">{{ test()!.score }} / {{ test()!.totalQuestions }} correct</p>
          <div class="results-actions">
            <button id="btn-new-test" class="btn-premium" (click)="router.navigate(['/mock-tests'])">New Test</button>
            <button id="btn-review" class="btn-secondary" (click)="showReview.set(!showReview())">Review Answers</button>
          </div>
          @if (showReview()) {
            <div class="review-list">
              @for (q of questions(); track q._id; let i = $index) {
                <div class="review-item glass-panel" style="background: rgba(255,255,255,0.01)">
                  <div class="review-num">Q{{ i + 1 }}</div>
                  <div class="review-q">{{ q.title }}</div>
                  <div class="review-ans">
                    <strong>Your answer:</strong> {{ answers()[q._id] || '—' }}<br/>
                    <strong>Answer:</strong> {{ q.answer | slice:0:120 }}...
                  </div>
                </div>
              }
            </div>
          }
        </div>
      } @else if (questions().length > 0) {
        <!-- Timer bar -->
        <div class="timer-bar">
          <div class="timer-info">
            <span>Question {{ currentIdx() + 1 }} / {{ questions().length }}</span>
            <span class="timer-clock" [class.urgent]="timeLeft() <= 60">⏱ {{ formatTime() }}</span>
          </div>
          <div class="timer-progress-wrap">
            <div class="timer-progress" [style.width.%]="timerPercent()" [class.urgent]="timeLeft() <= 60"></div>
          </div>
        </div>

        <!-- Question -->
        <div class="question-section glass-panel">
          <div class="q-number">Question {{ currentIdx() + 1 }}</div>
          <h2 class="q-text">{{ currentQuestion()?.title }}</h2>
          <p class="q-desc">{{ currentQuestion()?.description }}</p>

          <textarea
            [id]="'answer-' + currentQuestion()?._id"
            class="glass-input answer-input"
            [(ngModel)]="currentAnswer"
            placeholder="Type your answer here..."
            rows="6"
          ></textarea>

          <div class="nav-actions">
            <button id="btn-prev" class="btn-nav" [disabled]="currentIdx() === 0" (click)="prev()">← Previous</button>
            <button id="btn-skip" class="btn-nav" (click)="next()">Skip →</button>
            @if (currentIdx() === questions().length - 1) {
              <button id="btn-submit-test" class="btn-submit" (click)="submitTest()">Submit Test</button>
            } @else {
              <button id="btn-next" class="btn-premium-sm" (click)="saveAndNext()">Save & Next →</button>
            }
          </div>
        </div>

        <!-- Question nav dots -->
        <div class="q-dots">
          @for (q of questions(); track q._id; let i = $index) {
            <button
              [id]="'dot-' + i"
              class="dot"
              [class.current]="i === currentIdx()"
              [class.answered]="!!answers()[q._id]"
              (click)="goTo(i)"
            ></button>
          }
        </div>
      } @else {
        <div class="loading-state"><div class="spinner"></div><span>Loading test...</span></div>
      }
    </div>
  `,
  styles: [`
    .session-page { padding:36px; max-width:850px; margin:0 auto; }
    .timer-bar { margin-bottom:28px; }
    .timer-info { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:0.875rem; color:var(--color-text-muted); }
    .timer-clock { font-weight:700; font-size:1.1rem; color:white; }
    .timer-clock.urgent { color:var(--color-danger); text-shadow: 0 0 10px rgba(239, 68, 68, 0.4); animation:pulse 1s ease-in-out infinite; }
    .timer-progress-wrap { height:6px; background:rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.03); border-radius:3px; overflow:hidden; }
    .timer-progress { height:100%; background:linear-gradient(90deg, var(--color-accent), var(--color-accent-light)); border-radius:3px; transition:width 1s linear; box-shadow: 0 0 8px rgba(167, 139, 250, 0.4); }
    .timer-progress.urgent { background:var(--color-danger); box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }

    .question-section { padding:28px; margin-bottom:24px; }
    .q-number { font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.15em; color:var(--color-accent-light); margin-bottom:12px; }
    .q-text { font-size:1.4rem; font-weight:800; color:white; margin-bottom:14px; line-height:1.4; letter-spacing: -0.01em; }
    .q-desc { color:var(--color-text-muted); font-size:0.95rem; line-height:1.75; margin-bottom:24px; }
    .answer-input { width:100%; font-family:inherit; resize:vertical; line-height: 1.6; }

    .nav-actions { display:flex; gap:12px; margin-top:24px; }
    .btn-nav { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:10px; padding:10px 20px; font-size:0.875rem; color:var(--color-text-muted); cursor:pointer; transition:all 0.2s; font-weight: 600; }
    .btn-nav:hover:not(:disabled) { border-color:var(--color-accent-light); color:white; background: rgba(139,92,246,0.08); }
    .btn-nav:disabled { opacity:0.3; cursor:not-allowed; transform: none !important; }
    
    .btn-premium-sm { background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark)); color:white; border:none; border-radius:10px; padding:10px 22px; font-size:0.875rem; font-weight:700; cursor:pointer; margin-left:auto; transition:all 0.2s; box-shadow: 0 4px 12px rgba(109, 40, 217, 0.2); }
    .btn-premium-sm:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(109, 40, 217, 0.35); }
    .btn-submit { background: linear-gradient(135deg, var(--color-success), #059669); color:white; border:none; border-radius:10px; padding:10px 22px; font-size:0.875rem; font-weight:800; cursor:pointer; margin-left:auto; transition:all 0.2s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); }
    .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35); }

    .q-dots { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }
    .dot { width:12px; height:12px; border-radius:50%; border:2px solid rgba(255,255,255,0.08); background:transparent; cursor:pointer; transition:all 0.2s; }
    .dot.answered { background:var(--color-accent-light); border-color:var(--color-accent-light); box-shadow: 0 0 8px rgba(167, 139, 250, 0.4); }
    .dot.current { background:var(--color-success); border-color:var(--color-success); box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }

    .results-card { padding:44px; text-align:center; }
    .results-icon { font-size:3.5rem; margin-bottom:16px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
    .results-title { font-size:2rem; font-weight:900; color:white; margin-bottom:16px; letter-spacing: -0.02em; }
    .results-score { font-size:4.5rem; font-weight:900; margin-bottom:8px; letter-spacing: -0.03em; }
    .results-score.score-high { color:var(--color-success); text-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
    .results-score.score-mid { color:var(--color-warning); text-shadow: 0 0 20px rgba(245, 158, 11, 0.3); }
    .results-score.score-low { color:var(--color-danger); text-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
    .results-sub { color:var(--color-text-muted); font-size:1rem; font-weight: 500; margin-bottom:32px; }
    .results-actions { display:flex; gap:14px; justify-content:center; margin-bottom:32px; }
    .btn-secondary { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:10px; padding:12px 26px; font-size:0.9rem; font-weight:700; color:white; cursor:pointer; transition: all 0.2s; }
    .btn-secondary:hover { border-color: var(--color-accent-light); background: rgba(139,92,246,0.08); }
    .review-list { text-align:left; display:flex; flex-direction:column; gap:12px; margin-top:16px; }
    .review-item { padding:18px 24px; border-radius:12px; }
    .review-num { font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing: 0.1em; color:var(--color-accent-light); margin-bottom:6px; }
    .review-q { font-weight:700; font-size: 1rem; color:white; margin-bottom:8px; }
    .review-ans { font-size:0.875rem; color:var(--color-text-muted); line-height:1.65; }

    .loading-state { display:flex; align-items:center; gap:12px; color:var(--color-text-muted); padding:60px; justify-content:center; }
    .spinner { width:22px; height:22px; border:2px solid var(--color-border); border-top-color:var(--color-accent-light); border-radius:50%; animation:spin 0.7s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
  `],
})
export class TestSessionComponent implements OnInit, OnDestroy {
  test = signal<MockTest | null>(null);
  questions = signal<Question[]>([]);
  currentIdx = signal(0);
  answers = signal<Record<string, string>>({});
  currentAnswer = '';
  timeLeft = signal(0);
  completed = signal(false);
  showReview = signal(false);
  private timer: any;
  private startTime = Date.now();

  currentQuestion() { return this.questions()[this.currentIdx()]; }
  timerPercent() { const t = this.test(); return t ? (this.timeLeft() / (t.durationMinutes * 60)) * 100 : 100; }
  scorePercent() { const t = this.test(); return t?.totalQuestions ? Math.round((t.score / t.totalQuestions) * 100) : 0; }
  scoreClass() { const p = this.scorePercent(); return p >= 70 ? 'score-high' : p >= 40 ? 'score-mid' : 'score-low'; }

  formatTime() {
    const m = Math.floor(this.timeLeft() / 60);
    const s = this.timeLeft() % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private mockTestsApi: MockTestsApiService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.http.get<MockTest>(`http://localhost:3000/api/mock-tests/history`).subscribe({
      next: (tests: any) => {
        const test = Array.isArray(tests) ? tests.find((t: any) => t._id === id) : null;
        if (test) {
          this.test.set(test);
          this.questions.set(test.questions || []);
          this.timeLeft.set(test.durationMinutes * 60);
          this.startTimer();
        }
      },
    });
  }

  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft.update((t) => t - 1);
      if (this.timeLeft() <= 0) { clearInterval(this.timer); this.submitTest(); }
    }, 1000);
  }

  prev() {
    this.saveCurrentAnswer();
    if (this.currentIdx() > 0) this.currentIdx.update((i) => i - 1);
    this.loadCurrentAnswer();
  }

  next() {
    if (this.currentIdx() < this.questions().length - 1) this.currentIdx.update((i) => i + 1);
    this.loadCurrentAnswer();
  }

  saveAndNext() {
    this.saveCurrentAnswer();
    this.next();
  }

  goTo(i: number) {
    this.saveCurrentAnswer();
    this.currentIdx.set(i);
    this.loadCurrentAnswer();
  }

  saveCurrentAnswer() {
    const id = this.currentQuestion()?._id;
    if (id && this.currentAnswer.trim()) {
      this.answers.update((a) => ({ ...a, [id]: this.currentAnswer }));
    }
  }

  loadCurrentAnswer() {
    const id = this.currentQuestion()?._id;
    this.currentAnswer = id ? (this.answers()[id] ?? '') : '';
  }

  submitTest() {
    this.saveCurrentAnswer();
    if (this.timer) clearInterval(this.timer);
    const id = this.test()?._id;
    if (!id) return;
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.mockTestsApi.submit(id, this.answers(), elapsed).subscribe({
      next: (t) => { this.test.set(t); this.completed.set(true); },
    });
  }
}
