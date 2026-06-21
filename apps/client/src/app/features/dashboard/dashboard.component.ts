import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProgressService } from '../../core/services/progress.service';
import { ProgressSummary } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <div class="dash-header">
        <div>
          <h1 class="dash-greeting">Good {{ timeOfDay }}, {{ userName }}! 👋</h1>
          <p class="dash-sub">Ready to crush your interview prep today?</p>
        </div>
        <div class="streak-badge" title="Current streak">
          🔥 {{ summary()?.streak ?? 0 }} day streak
        </div>
      </div>

      <!-- Stats grid -->
      <div class="stats-grid">
        <div class="stat-card glass-panel accent">
          <div class="stat-icon">📚</div>
          <div class="stat-value glow-text-accent">{{ summary()?.reviewed ?? 0 }}</div>
          <div class="stat-label">Reviewed</div>
        </div>
        <div class="stat-card glass-panel success">
          <div class="stat-icon">✅</div>
          <div class="stat-value glow-text-success">{{ summary()?.mastered ?? 0 }}</div>
          <div class="stat-label">Mastered</div>
        </div>
        <div class="stat-card glass-panel warning">
          <div class="stat-icon">🔖</div>
          <div class="stat-value glow-text-warning">{{ summary()?.bookmarked ?? 0 }}</div>
          <div class="stat-label">Bookmarked</div>
        </div>
        <div class="stat-card glass-panel info">
          <div class="stat-icon">🧪</div>
          <div class="stat-value" style="color: #06B6D4; text-shadow: 0 0 12px rgba(6, 182, 212, 0.4)">{{ summary()?.testsCompleted ?? 0 }}</div>
          <div class="stat-label">Tests Done</div>
        </div>
        <div class="stat-card glass-panel purple">
          <div class="stat-icon">🎯</div>
          <div class="stat-value" style="color: #D946EF; text-shadow: 0 0 12px rgba(217, 70, 239, 0.4)">{{ summary()?.avgScore ?? 0 }}%</div>
          <div class="stat-label">Avg. Score</div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="section-title">Quick Start Modules</div>
      <div class="quick-actions">
        <a id="qa-angular" routerLink="/questions/angular" class="qa-card glass-panel angular">
          <div class="qa-icon-wrap" style="background: rgba(255, 62, 108, 0.08); border: 1px solid rgba(255, 62, 108, 0.15)">
            <span class="qa-icon" style="color: #FF3E6C; text-shadow: 0 0 8px rgba(255, 62, 108, 0.4)">▲</span>
          </div>
          <div class="qa-content">
            <span class="qa-label">Angular Qs</span>
            <span class="qa-desc">RxJS, Signals, components</span>
          </div>
          <span class="qa-arrow">→</span>
        </a>
        <a id="qa-js" routerLink="/questions/javascript" class="qa-card glass-panel js">
          <div class="qa-icon-wrap" style="background: rgba(247, 223, 30, 0.05); border: 1px solid rgba(247, 223, 30, 0.15)">
            <span class="qa-icon" style="color: #F7DF1E; text-shadow: 0 0 8px rgba(247, 223, 30, 0.4)">⬡</span>
          </div>
          <div class="qa-content">
            <span class="qa-label">JavaScript Qs</span>
            <span class="qa-desc">Core JS, Async, Closures</span>
          </div>
          <span class="qa-arrow">→</span>
        </a>
        <a id="qa-system" routerLink="/questions/system-design" class="qa-card glass-panel system">
          <div class="qa-icon-wrap" style="background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.15)">
            <span class="qa-icon" style="color: #06B6D4; text-shadow: 0 0 8px rgba(6, 182, 212, 0.4)">◈</span>
          </div>
          <div class="qa-content">
            <span class="qa-label">System Design</span>
            <span class="qa-desc">Scalability, Architecture</span>
          </div>
          <span class="qa-arrow">→</span>
        </a>
        <a id="qa-mock" routerLink="/mock-tests" class="qa-card glass-panel mock">
          <div class="qa-icon-wrap" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.15)">
            <span class="qa-icon" style="color: #10B981; text-shadow: 0 0 8px rgba(16, 185, 129, 0.4)">⏱</span>
          </div>
          <div class="qa-content">
            <span class="qa-label">Mock Tests</span>
            <span class="qa-desc">Simulated timed exams</span>
          </div>
          <span class="qa-arrow">→</span>
        </a>
        <a id="qa-notes" routerLink="/notes" class="qa-card glass-panel notes">
          <div class="qa-icon-wrap" style="background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.15)">
            <span class="qa-icon" style="color: #8B5CF6; text-shadow: 0 0 8px rgba(139, 92, 246, 0.4)">✎</span>
          </div>
          <div class="qa-content">
            <span class="qa-label">My Notes</span>
            <span class="qa-desc">Obsidian markdown notes</span>
          </div>
          <span class="qa-arrow">→</span>
        </a>
        <a id="qa-analytics" routerLink="/analytics" class="qa-card glass-panel analytics-card">
          <div class="qa-icon-wrap" style="background: rgba(217, 70, 239, 0.08); border: 1px solid rgba(217, 70, 239, 0.15)">
            <span class="qa-icon" style="color: #D946EF; text-shadow: 0 0 8px rgba(217, 70, 239, 0.4)">◎</span>
          </div>
          <div class="qa-content">
            <span class="qa-label">Analytics</span>
            <span class="qa-desc">Daily heatmap & progress</span>
          </div>
          <span class="qa-arrow">→</span>
        </a>
      </div>

      <!-- Progress bar -->
      @if (summary()) {
        <div class="section-title">Today's Progress</div>
        <div class="progress-section glass-panel">
          <div class="progress-bar-wrap">
            <div class="progress-bar" [style.width.%]="masteredPct()"></div>
          </div>
          <span class="progress-text">{{ summary()!.mastered }} / {{ summary()!.total }} mastered</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard { padding: 36px; max-width: 1200px; }
    .dash-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; }
    .dash-greeting { font-size:2rem; font-weight:900; color:white; margin-bottom:6px; letter-spacing:-0.02em; }
    .dash-sub { color:var(--color-text-muted); font-size:0.95rem; }
    .streak-badge {
      background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.12));
      border:1px solid rgba(245,158,11,0.25);
      color:var(--color-warning);
      border-radius:20px;
      padding:8px 18px;
      font-weight:700;
      font-size:0.9rem;
      box-shadow: 0 0 15px rgba(245,158,11,0.1);
      backdrop-filter: blur(8px);
    }

    .stats-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-bottom:36px; }
    .stat-card { padding:22px; text-align:center; cursor: default; }
    .stat-card:hover { transform:translateY(-4px); border-color: rgba(255, 255, 255, 0.12); }
    .stat-card.accent:hover { box-shadow: 0 10px 30px rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.25); }
    .stat-card.success:hover { box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.25); }
    .stat-card.warning:hover { box-shadow: 0 10px 30px rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.25); }
    .stat-card.info:hover { box-shadow: 0 10px 30px rgba(6, 182, 212, 0.15); border-color: rgba(6, 182, 212, 0.25); }
    .stat-card.purple:hover { box-shadow: 0 10px 30px rgba(217, 70, 239, 0.15); border-color: rgba(217, 70, 239, 0.25); }
    .stat-icon { font-size:1.6rem; margin-bottom:8px; }
    .stat-value { font-size:2.25rem; font-weight:900; margin-bottom:4px; letter-spacing: -0.02em; }
    .stat-label { font-size:0.75rem; color:var(--color-text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.05em; }

    .section-title { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-text-muted); margin-bottom:16px; padding-left: 2px; }

    .quick-actions { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:36px; }
    .qa-card { display:flex; align-items:center; gap:16px; padding:20px; text-decoration:none; transition:all 0.25s cubic-bezier(0.4, 0, 0.2, 1); cursor:pointer; }
    .qa-card:hover { transform:translateY(-4px); border-color: rgba(255, 255, 255, 0.12); }
    .qa-icon-wrap { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .qa-icon { font-size:1.35rem; }
    .qa-content { flex:1; display:flex; flex-direction:column; gap:2px; min-width:0; }
    .qa-label { font-weight:700; font-size:0.95rem; color:white; }
    .qa-desc { font-size:0.75rem; color:var(--color-text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .qa-arrow { color:var(--color-text-muted); font-size: 1.1rem; transition:all 0.25s; padding-right: 4px; }
    .qa-card:hover .qa-arrow { transform:translateX(4px); color: white; }

    .qa-card.angular:hover { box-shadow: 0 10px 30px rgba(255, 62, 108, 0.15); border-color: rgba(255, 62, 108, 0.3); }
    .qa-card.js:hover { box-shadow: 0 10px 30px rgba(247, 223, 30, 0.12); border-color: rgba(247, 223, 30, 0.3); }
    .qa-card.system:hover { box-shadow: 0 10px 30px rgba(6, 182, 212, 0.15); border-color: rgba(6, 182, 212, 0.3); }
    .qa-card.mock:hover { box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3); }
    .qa-card.notes:hover { box-shadow: 0 10px 30px rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.3); }
    .qa-card.analytics-card:hover { box-shadow: 0 10px 30px rgba(217, 70, 239, 0.15); border-color: rgba(217, 70, 239, 0.3); }

    .progress-section { display:flex; align-items:center; gap:20px; padding: 20px 24px; }
    .progress-bar-wrap { flex:1; height:10px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.04); border-radius:6px; overflow:hidden; }
    .progress-bar { height:100%; background:linear-gradient(90deg,var(--color-accent),var(--color-accent-light)); border-radius:6px; transition:width 0.8s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 10px rgba(167, 139, 250, 0.4); }
    .progress-text { font-size:0.875rem; font-weight: 600; color:var(--color-accent-light); white-space:nowrap; text-shadow: 0 0 10px rgba(167, 139, 250, 0.2); }

    @media (max-width:980px) { .stats-grid { grid-template-columns:repeat(3,1fr); } .quick-actions { grid-template-columns:1fr 1fr; } }
    @media (max-width:650px) { .stats-grid { grid-template-columns:1fr 1fr; } .quick-actions { grid-template-columns:1fr; } .dash-header { flex-direction:column; gap:16px; } }
  `],
})
export class DashboardComponent implements OnInit {
  summary = signal<ProgressSummary | null>(null);

  get userName() {
    return this.authService.user()?.name?.split(' ')[0] ?? 'there';
  }

  get timeOfDay() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  }

  masteredPct() {
    const s = this.summary();
    if (!s || !s.total) return 0;
    return Math.round((s.mastered / s.total) * 100);
  }

  constructor(
    public authService: AuthService,
    private progressService: ProgressService,
  ) {}

  ngOnInit() {
    this.progressService.getSummary().subscribe({
      next: (s) => this.summary.set(s),
      error: () => {},
    });
  }
}
