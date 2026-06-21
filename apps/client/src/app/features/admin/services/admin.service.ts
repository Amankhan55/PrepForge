import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../../../core/models/models';

export interface CreateQuestionPayload {
  category: 'angular' | 'javascript' | 'system-design';
  topic: string;
  title: string;
  description: string;
  answer: string;
  codeSnippet?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  order?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/questions';
  constructor(private http: HttpClient) {}

  getAll(params: any = {}): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl, { params });
  }

  create(payload: CreateQuestionPayload): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, payload);
  }

  update(id: string, payload: Partial<CreateQuestionPayload>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
