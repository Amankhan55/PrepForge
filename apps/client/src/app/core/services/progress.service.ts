import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProgress, ProgressSummary } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private apiUrl = 'http://localhost:3000/api/progress';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserProgress[]> {
    return this.http.get<UserProgress[]>(this.apiUrl);
  }

  getSummary(): Observable<ProgressSummary> {
    return this.http.get<ProgressSummary>(`${this.apiUrl}/summary`);
  }

  getActivity(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/activity`);
  }

  update(questionId: string, data: { status?: string; bookmarked?: boolean }): Observable<UserProgress> {
    return this.http.put<UserProgress>(`${this.apiUrl}/${questionId}`, data);
  }
}
