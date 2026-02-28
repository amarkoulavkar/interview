import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { Observable } from 'rxjs';
import { Question } from '../../models/question';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar bg-light p-3 h-100">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Questions</h5>
        <a class="btn btn-sm btn-primary" routerLink="/add">+ Add</a>
      </div>
      <ul class="list-group">
        <li *ngFor="let q of questions$ | async" class="list-group-item list-group-item-action mb-1" routerLinkActive="active" [routerLink]="['/question', q._id]">
          <div class="fw-bold text-secondary">{{ q.technology }}</div>
          <div class="small text-dark">{{ q.question | slice:0:60 }}{{ q.question.length>60 ? '...' : '' }}</div>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `:host { display:block; height:100%; }
    .sidebar { min-width:260px; max-width:340px; }
    .active, .list-group-item:hover { background:#e9ecef; }
    .list-group-item { cursor:pointer; }
    .btn { font-size:0.95rem; }
    h5 { font-weight:600; }`
  ]
})
export class SidebarComponent {
  questions$: Observable<Question[] | null>;

  constructor(private qs: QuestionService) {
    // trigger load if needed
    this.questions$ = this.qs.getQuestions();
    this.qs.ensureLoaded().subscribe({ next: () => {}, error: () => {} });
  }
}
