import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuestionsService } from '../../../core/services/questions.service';
import { ProgressService } from '../../../core/services/progress.service';
import { Question, UserProgress } from '../../../core/models/models';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-page">
      @if (loading()) {
        <div class="loading-state"><div class="spinner"></div><span>Loading...</span></div>
      } @else if (question()) {
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <a [routerLink]="['/questions', question()!.category]" class="bc-link">← {{ question()!.category | titlecase }}</a>
          <span class="bc-sep">/</span>
          <span class="bc-current">{{ question()!.title }}</span>
        </div>

        <!-- Question card -->
        <div class="q-header glass-panel">
          <div class="q-meta">
            <span class="difficulty-badge" [class]="'diff-' + question()!.difficulty">{{ question()!.difficulty }}</span>
            <span class="topic-badge">{{ question()!.topic }}</span>
            @for (tag of question()!.tags; track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
          <h1 class="q-title">{{ question()!.title }}</h1>
          <p class="q-desc">{{ question()!.description }}</p>
        </div>

        <!-- Action buttons -->
        <div class="action-bar">
          <button
            [id]="'btn-status-' + question()!._id"
            class="action-btn glass-panel"
            [class.active-reviewed]="progress()?.status === 'reviewed'"
            [class.active-mastered]="progress()?.status === 'mastered'"
            (click)="cycleStatus()"
          >
            {{ statusLabel() }}
          </button>
          <button
            [id]="'btn-bookmark-' + question()!._id"
            class="action-btn bookmark-btn glass-panel"
            [class.bookmarked]="progress()?.bookmarked"
            (click)="toggleBookmark()"
          >
            {{ progress()?.bookmarked ? '🔖 Bookmarked' : '☆ Bookmark' }}
          </button>
          <button id="btn-reveal-answer" class="action-btn glass-panel btn-reveal" [class.answer-shown]="showAnswer()" (click)="showAnswer.set(!showAnswer())">
            {{ showAnswer() ? '🙈 Hide Answer' : '👁 Reveal Answer' }}
          </button>
        </div>

        <!-- Answer section -->
        @if (showAnswer()) {
          <div class="answer-section glass-panel">
            <div class="answer-header">📖 Answer Explanation</div>
            <div class="answer-content">{{ question()!.answer }}</div>

            @if (question()!.codeSnippet) {
              <div class="code-block-wrap">
                <div class="code-header">
                  <div class="mac-window-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                  </div>
                  <span class="code-title">Code Snippet</span>
                  <button class="copy-btn" (click)="copyCode()">{{ copied() ? '✓ Copied' : '⎘ Copy' }}</button>
                </div>
                <pre><code>{{ question()!.codeSnippet }}</code></pre>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .detail-page { padding:36px; max-width:850px; }
    .breadcrumb { display:flex; align-items:center; gap:8px; margin-bottom:28px; font-size:0.875rem; font-weight: 500; }
    .bc-link { color:var(--color-accent-light); text-decoration:none; transition: color 0.2s; }
    .bc-link:hover { color: white; text-shadow: 0 0 10px rgba(167, 139, 250, 0.4); }
    .bc-sep { color: rgba(255,255,255,0.08); }
    .bc-current { color:var(--color-text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

    .q-header { padding: 28px; margin-bottom:28px; }
    .q-meta { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:20px; }
    .difficulty-badge { font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; padding:4px 10px; border-radius:6px; }
    .diff-beginner { background:rgba(16,185,129,0.12); border: 1px solid rgba(16, 185, 129, 0.2); color:var(--color-success); }
    .diff-intermediate { background:rgba(245,158,11,0.12); border: 1px solid rgba(245, 158, 11, 0.2); color:var(--color-warning); }
    .diff-advanced { background:rgba(239,68,68,0.12); border: 1px solid rgba(239, 68, 68, 0.2); color:var(--color-danger); }
    .topic-badge { background:rgba(139,92,246,0.12); border: 1px solid rgba(139, 92, 246, 0.2); color:var(--color-accent-light); border-radius:6px; padding:4px 10px; font-size:0.75rem; font-weight:700; }
    .tag { background:rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius:4px; padding:3px 8px; font-size:0.7rem; color:var(--color-text-muted); }
    .q-title { font-size:1.85rem; font-weight:900; color:white; margin-bottom:14px; line-height:1.3; letter-spacing: -0.02em; }
    .q-desc { color:var(--color-text-muted); font-size:0.95rem; line-height:1.75; }

    .action-bar { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:28px; }
    .action-btn { border-radius:10px; padding:10px 18px; font-size:0.875rem; font-weight:600; color:var(--color-text-muted); cursor:pointer; transition:all 0.25s; }
    .action-btn:hover { border-color:var(--color-accent-light); color:white; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15); }
    .action-btn.active-reviewed { background:rgba(16,185,129,0.08); border-color:var(--color-success); color:var(--color-success); text-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
    .action-btn.active-mastered { background:rgba(139,92,246,0.08); border-color:var(--color-accent-light); color:var(--color-accent-light); text-shadow: 0 0 10px rgba(167, 139, 250, 0.2); }
    .bookmark-btn.bookmarked { background:rgba(245,158,11,0.08); border-color:var(--color-warning); color:var(--color-warning); text-shadow: 0 0 10px rgba(245, 158, 11, 0.2); }
    .btn-reveal.answer-shown { background: rgba(139, 92, 246, 0.1); border-color: var(--color-accent); color: white; }

    .answer-section { border-radius:16px; overflow:hidden; animation:slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-top: 16px; }
    .answer-header { padding:16px 24px; font-size:0.8rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-accent-light); border-bottom:1px solid var(--color-border); background: rgba(255,255,255,0.01); }
    .answer-content { padding:24px; color:var(--color-text); line-height:1.8; font-size:0.975rem; white-space:pre-wrap; }
    
    .code-block-wrap { border-top:1px solid var(--color-border); }
    .code-header { display:flex; justify-content:space-between; align-items:center; padding:12px 24px; background:rgba(0,0,0,0.3); font-size:0.8rem; color:var(--color-text-muted); }
    .mac-window-dots { display: flex; gap: 6px; align-items: center; }
    .mac-window-dots .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .mac-window-dots .dot.red { background: #FF5F56; }
    .mac-window-dots .dot.yellow { background: #FFBD2E; }
    .mac-window-dots .dot.green { background: #27C93F; }
    .code-title { font-weight: 600; font-size: 0.8rem; color: var(--color-text-muted); letter-spacing: 0.05em; text-transform: uppercase; }
    .copy-btn { background:rgba(255,255,255,0.02); border:1px solid var(--color-border); border-radius:6px; padding:4px 10px; color:var(--color-text-muted); cursor:pointer; font-size:0.75rem; transition:all 0.2s; font-weight: 600; }
    .copy-btn:hover { border-color:var(--color-accent-light); color:white; background: rgba(139,92,246,0.1); }
    pre { margin:0; border:none; border-radius:0; background: rgba(5,5,10,0.6); }

    .loading-state { display:flex; align-items:center; gap:12px; color:var(--color-text-muted); padding:60px; justify-content:center; }
    .spinner { width:22px; height:22px; border:2px solid var(--color-border); border-top-color:var(--color-accent-light); border-radius:50%; animation:spin 0.7s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
  `],
})
export class QuestionDetailComponent implements OnInit {
  question = signal<Question | null>(null);
  progress = signal<UserProgress | null>(null);
  loading = signal(true);
  showAnswer = signal(false);
  copied = signal(false);

  statusLabel() {
    const s = this.progress()?.status;
    if (s === 'mastered') return '⭐ Mastered';
    if (s === 'reviewed') return '✓ Reviewed';
    return '○ Mark Reviewed';
  }

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService,
    private progressService: ProgressService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.questionsService.getById(id).subscribe({
      next: (q) => { this.question.set(q); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.progressService.getAll().subscribe({
      next: (all) => {
        const p = all.find((x) => x.questionId === id) ?? null;
        this.progress.set(p);
      },
    });
  }

  cycleStatus() {
    const id = this.question()?._id;
    if (!id) return;
    const current = this.progress()?.status ?? 'unseen';
    const next = current === 'unseen' ? 'reviewed' : current === 'reviewed' ? 'mastered' : 'unseen';
    this.progressService.update(id, { status: next }).subscribe({
      next: (p) => this.progress.set(p),
    });
  }

  toggleBookmark() {
    const id = this.question()?._id;
    if (!id) return;
    const current = this.progress()?.bookmarked ?? false;
    this.progressService.update(id, { bookmarked: !current }).subscribe({
      next: (p) => this.progress.set(p),
    });
  }

  copyCode() {
    const code = this.question()?.codeSnippet;
    if (code) {
      navigator.clipboard.writeText(code);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }
}
