import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Note } from '../../../core/models/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotesApiService {
  private apiUrl = 'http://localhost:3000/api/notes';
  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<Note[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<Note[]>(this.apiUrl, { params });
  }

  create(title: string, content: string, questionId?: string): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, { title, content, questionId });
  }

  update(id: string, title?: string, content?: string): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, { title, content });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
