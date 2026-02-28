import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { Question } from '../models/question';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  // Local cache for list of questions so sidebar can update reactively
  private questions$ = new BehaviorSubject<Question[] | null>(null);

  constructor(private http: HttpClient) {}

  fetchQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(API_ENDPOINTS.GET_QUESTIONS).pipe(
      tap(list => this.questions$.next(list))
    );
  }

  getQuestions(): Observable<Question[] | null> {
    return this.questions$.asObservable();
  }

  ensureLoaded(): Observable<Question[]> {
    // If already loaded, return current value as observable; otherwise fetch
    const current = this.questions$.getValue();
    if (current && current.length) {
      return this.questions$.asObservable() as Observable<Question[]>;
    }
    return this.fetchQuestions();
  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(API_ENDPOINTS.GET_QUESTION(id));
  }

  addQuestion(payload: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(API_ENDPOINTS.ADD_QUESTION, payload).pipe(
      tap(newQ => {
        const list = this.questions$.getValue() || [];
        this.questions$.next([newQ, ...list]);
      })
    );
  }

  updateQuestion(id: string, payload: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(API_ENDPOINTS.UPDATE_QUESTION(id), payload).pipe(
      tap(updated => {
        const list = this.questions$.getValue() || [];
        const idx = list.findIndex(q => q.id === id);
        if (idx !== -1) {
          list[idx] = updated;
          this.questions$.next([...list]);
        }
      })
    );
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.DELETE_QUESTION(id)).pipe(
      tap(() => {
        const list = this.questions$.getValue() || [];
        this.questions$.next(list.filter(q => q.id !== id));
      })
    );
  }
}
