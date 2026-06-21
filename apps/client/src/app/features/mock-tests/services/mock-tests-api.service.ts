import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MockTest } from '../../../core/models/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockTestsApiService {
  private apiUrl = 'http://localhost:3000/api/mock-tests';
  constructor(private http: HttpClient) {}

  start(category: string, difficulty: string, durationMinutes: number, questionCount = 20): Observable<MockTest> {
    return this.http.post<MockTest>(`${this.apiUrl}/start`, { category, difficulty, durationMinutes, questionCount });
  }

  submit(id: string, answers: Record<string, string>, timeTakenSeconds: number): Observable<MockTest> {
    return this.http.put<MockTest>(`${this.apiUrl}/${id}/submit`, { answers, timeTakenSeconds });
  }

  getHistory(): Observable<MockTest[]> {
    return this.http.get<MockTest[]>(`${this.apiUrl}/history`);
  }

  getScoreTrend(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/score-trend`);
  }
}
