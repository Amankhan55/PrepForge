import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProgressService } from '../../../core/services/progress.service';
import { ProgressSummary } from '../../../core/models/models';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-page">
      <div class="analytics-header">
        <h1 class="analytics-title">Progress Analytics</h1>
        <p class="analytics-sub">Track your interview prep journey over time</p>
      </div>

      <!-- Summary cards -->
      @if (summary()) {
        <div class="summary-row">
          <div class="summary-card glass-panel">
            <div class="sc-icon">🔥</div>
            <div class="sc-value glow-text-warning" style="color: var(--color-warning)">{{ summary()!.streak }}</div>
            <div class="sc-label">Day Streak</div>
          </div>
          <div class="summary-card glass-panel">
            <div class="sc-icon">📚</div>
            <div class="sc-value glow-text-accent" style="color: var(--color-accent-light)">{{ summary()!.reviewed }}</div>
            <div class="sc-label">Reviewed</div>
          </div>
          <div class="summary-card glass-panel">
            <div class="sc-icon">⭐</div>
            <div class="sc-value glow-text-success" style="color: var(--color-success)">{{ summary()!.mastered }}</div>
            <div class="sc-label">Mastered</div>
          </div>
          <div class="summary-card glass-panel">
            <div class="sc-icon">🎯</div>
            <div class="sc-value" style="color: #06B6D4; text-shadow: 0 0 12px rgba(6, 182, 212, 0.4)">{{ summary()!.avgScore }}%</div>
            <div class="sc-label">Avg. Score</div>
          </div>
          <div class="summary-card glass-panel">
            <div class="sc-icon">🧪</div>
            <div class="sc-value" style="color: #D946EF; text-shadow: 0 0 12px rgba(217, 70, 239, 0.4)">{{ summary()!.testsCompleted }}</div>
            <div class="sc-label">Tests Done</div>
          </div>
        </div>
      }

      <!-- Activity Heatmap -->
      <div class="analytics-card glass-panel">
        <div class="card-title">📅 Daily Activity (Last 12 Weeks)</div>
        <div class="heatmap">
          @for (week of heatmapWeeks(); track $index) {
            <div class="heatmap-week">
              @for (day of week; track day.date) {
                <div
                  class="heatmap-cell"
                  [class]="'heat-' + day.level"
                  [title]="day.date + ': ' + day.count + ' questions'"
                ></div>
              }
            </div>
          }
        </div>
        <div class="heatmap-legend">
          <span>Less</span>
          <div class="heat-0 legend-cell"></div>
          <div class="heat-1 legend-cell"></div>
          <div class="heat-2 legend-cell"></div>
          <div class="heat-3 legend-cell"></div>
          <div class="heat-4 legend-cell"></div>
          <span>More</span>
        </div>
      </div>

      <!-- Score trend -->
      @if (scoreTrend().length > 0) {
        <div class="analytics-card glass-panel">
          <div class="card-title">📈 Test Score Trend</div>
          <div class="score-chart">
            @for (item of scoreTrend(); track item.date) {
              <div class="score-bar-wrap" [title]="item.category + ': ' + item.percentage + '%'">
                <div class="score-bar-fill" [style.height.%]="item.percentage" [class]="getScoreClass(item.percentage)"></div>
                <div class="score-bar-label">{{ item.percentage }}%</div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Topic breakdown -->
      @if (topicRadar().length > 0) {
        <div class="analytics-card glass-panel">
          <div class="card-title">🗺 Topics Reviewed</div>
          <div class="topic-list">
            @for (item of topicRadar().slice(0, 15); track item._id.topic) {
              <div class="topic-row">
                <span class="topic-cat" [class]="'cat-' + item._id.category">{{ item._id.category }}</span>
                <span class="topic-name">{{ item._id.topic }}</span>
                <div class="topic-bar-wrap">
                  <div class="topic-bar" [style.width.%]="(item.count / topicMax()) * 100"></div>
                </div>
                <span class="topic-count">{{ item.count }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .analytics-page { padding:36px; max-width:1050px; }
    .analytics-header { margin-bottom:32px; }
    .analytics-title { font-size:2rem; font-weight:900; color:white; margin-bottom:4px; letter-spacing: -0.02em; }
    .analytics-sub { color:var(--color-text-muted); font-size:0.95rem; }

    .summary-row { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-bottom:28px; }
    .summary-card { padding:20px; text-align:center; }
    .sc-icon { font-size:1.6rem; margin-bottom:8px; }
    .sc-value { font-size:1.85rem; font-weight:900; margin-bottom:4px; letter-spacing: -0.01em; }
    .sc-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); }

    .analytics-card { padding:24px; margin-bottom:24px; }
    .card-title { font-size:0.85rem; font-weight:700; color:white; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom:24px; }

    /* Heatmap */
    .heatmap { display:flex; gap:4px; overflow-x:auto; padding-bottom:8px; }
    .heatmap-week { display:flex; flex-direction:column; gap:4px; }
    .heatmap-cell { width:15px; height:15px; border-radius:3px; transition: all 0.25s; border: 1px solid rgba(255,255,255,0.01); }
    .heatmap-cell:hover { transform: scale(1.2); z-index: 10; border-color: rgba(255,255,255,0.1); }
    .legend-cell { width:15px; height:15px; border-radius:3px; }
    .heatmap-legend { display:flex; align-items:center; gap:6px; margin-top:16px; font-size:0.75rem; color:var(--color-text-muted); font-weight: 500; }
    
    .heat-0 { background:rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.03); }
    .heat-1 { background:rgba(139, 92, 246, 0.18); box-shadow: 0 0 5px rgba(139, 92, 246, 0.1); }
    .heat-2 { background:rgba(139, 92, 246, 0.4); box-shadow: 0 0 8px rgba(139, 92, 246, 0.2); }
    .heat-3 { background:rgba(139, 92, 246, 0.65); box-shadow: 0 0 12px rgba(167, 139, 250, 0.35); }
    .heat-4 { background:var(--color-accent-light); box-shadow: 0 0 15px rgba(167, 139, 250, 0.65); }

    /* Score chart */
    .score-chart { display:flex; gap:10px; align-items:flex-end; height:150px; padding-top:12px; }
    .score-bar-wrap { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; height:100%; justify-content:flex-end; }
    .score-bar-fill { width:100%; border-radius:6px 6px 0 0; min-height:4px; transition:height 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
    
    .score-bar-fill.score-high { background: linear-gradient(180deg, var(--color-success), rgba(16, 185, 129, 0.2)); box-shadow: 0 0 10px rgba(16, 185, 129, 0.3); }
    .score-bar-fill.score-mid { background: linear-gradient(180deg, var(--color-warning), rgba(245, 158, 11, 0.2)); box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }
    .score-bar-fill.score-low { background: linear-gradient(180deg, var(--color-danger), rgba(239, 68, 68, 0.2)); box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); }
    .score-bar-label { font-size:0.7rem; font-weight: 700; color:var(--color-text-muted); }

    /* Topic list */
    .topic-list { display:flex; flex-direction:column; gap:14px; }
    .topic-row { display:grid; grid-template-columns:110px 140px 1fr 40px; gap:16px; align-items:center; font-size:0.9rem; }
    .topic-cat { font-size:0.7rem; font-weight:800; text-transform:uppercase; padding:3px 8px; border-radius:6px; text-align: center; letter-spacing: 0.05em; }
    .cat-angular { background:rgba(255,62,108,0.12); border: 1px solid rgba(255,62,108,0.2); color:#FF3E6C; }
    .cat-javascript { background:rgba(247,223,30,0.08); border: 1px solid rgba(247,223,30,0.2); color:#F7DF1E; }
    .cat-system-design { background:rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.2); color:#06B6D4; }
    .topic-name { color:white; font-weight:600; }
    .topic-bar-wrap { height:8px; background:rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.03); border-radius:4px; overflow:hidden; }
    .topic-bar { height:100%; background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light)); border-radius:4px; transition:width 0.8s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 8px rgba(167, 139, 250, 0.3); }
    .topic-count { text-align:right; color:var(--color-text-muted); font-weight:700; }

    @media (max-width:768px) { .summary-row { grid-template-columns:repeat(3,1fr); } .topic-row { grid-template-columns: 80px 110px 1fr 30px; gap: 10px; } }
  `],
})
export class AnalyticsComponent implements OnInit {
  summary = signal<ProgressSummary | null>(null);
  activity = signal<Record<string, number>>({});
  scoreTrend = signal<any[]>([]);
  topicRadar = signal<any[]>([]);

  heatmapWeeks = signal<Array<Array<{ date: string; count: number; level: number }>>>([]);

  topicMax() {
    const topics = this.topicRadar();
    return topics.length ? Math.max(...topics.map((t) => t.count)) : 1;
  }

  getScoreClass(pct: number) {
    return pct >= 70 ? 'score-high' : pct >= 40 ? 'score-mid' : 'score-low';
  }

  constructor(private http: HttpClient, private progressService: ProgressService) {}

  ngOnInit() {
    this.http.get<ProgressSummary>('http://localhost:3000/api/analytics/summary').subscribe({
      next: (s) => this.summary.set(s),
    });

    this.http.get<Record<string, number>>('http://localhost:3000/api/analytics/heatmap').subscribe({
      next: (a) => { this.activity.set(a); this.buildHeatmap(a); },
    });

    this.http.get<any[]>('http://localhost:3000/api/mock-tests/score-trend').subscribe({
      next: (t) => this.scoreTrend.set(t.slice(-20)),
    });

    this.http.get<any[]>('http://localhost:3000/api/analytics/radar').subscribe({
      next: (r) => this.topicRadar.set(r),
    });
  }

  buildHeatmap(activity: Record<string, number>) {
    const weeks: Array<Array<{ date: string; count: number; level: number }>> = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 83); // 12 weeks

    let currentWeek: Array<{ date: string; count: number; level: number }> = [];
    const d = new Date(startDate);
    while (d <= today) {
      const dateStr = d.toISOString().split('T')[0];
      const count = activity[dateStr] ?? 0;
      const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4;
      currentWeek.push({ date: dateStr, count, level });
      if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
      d.setDate(d.getDate() + 1);
    }
    if (currentWeek.length) weeks.push(currentWeek);
    this.heatmapWeeks.set(weeks);
  }
}
