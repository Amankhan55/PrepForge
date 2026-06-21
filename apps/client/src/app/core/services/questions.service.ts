import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/models';

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  private apiUrl = 'http://localhost:3000/api/questions';

  constructor(private http: HttpClient) {}

  getAll(params: {
    category?: string;
    topic?: string;
    difficulty?: string;
    search?: string;
    tag?: string;
  } = {}): Observable<Question[]> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => { if (v) httpParams = httpParams.set(k, v); });
    return this.http.get<Question[]>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  getTopics(category?: string): Observable<string[]> {
    const params = category ? new HttpParams().set('category', category) : undefined;
    return this.http.get<string[]>(`${this.apiUrl}/topics`, { params });
  }
}
