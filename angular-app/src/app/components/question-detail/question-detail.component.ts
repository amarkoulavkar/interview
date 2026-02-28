import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { switchMap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="question$ | async as q; else loading">
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-primary text-white">
          <div class="d-flex justify-content-between align-items-center">
            <span class="fs-5">Question Details</span>
            <span class="badge bg-light text-dark">{{ q.technology }}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 class="card-title mb-1">{{ q.question }}</h5>
            </div>
            <div class="btn-group">
              <a class="btn btn-sm btn-outline-primary" [routerLink]="['/question', q._id, 'edit']">Edit</a>
              <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(q._id)">Delete</button>
            </div>
          </div>

          <div class="mb-2">
            <strong>Technology:</strong>
            <span class="ms-2 text-secondary">{{ q.technology }}</span>
          </div>
          <div class="mb-2">
            <strong>Answer:</strong>
            <div class="card-text border rounded p-2 bg-light" [innerHTML]="getSafeAnswer(q.answer)"></div>
          </div>
        </div>
      </div>
    </div>
    <ng-template #loading>
      <div class="alert alert-info">Loading...</div>
    </ng-template>
  `,
  styles: [
    `:host { display:block; padding:24px; } 
    .card-title { font-weight:600; }
    .card-text { white-space:pre-wrap; }`
  ]
})
export class QuestionDetailComponent {
  question$ = this.route.paramMap.pipe(
    switchMap(pm => this.qs.getQuestion(pm.get('id') || ''))
  );
  isDeleting = false;
  successMessage: string | null = null;

  constructor(private route: ActivatedRoute, private qs: QuestionService, private router: Router, private sanitizer: DomSanitizer) {}

  getSafeAnswer(answer: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(answer);
  }

  confirmDelete(id: string) {
    if (!confirm('Delete this question?')) return;
    this.isDeleting = true;
    this.qs.deleteQuestion(id).subscribe({
      next: () => {
        // force refresh the questions cache so sidebar updates immediately
        this.qs.fetchQuestions().subscribe({
          next: () => {
            this.isDeleting = false;
            this.successMessage = 'Question deleted';
            // show success briefly then navigate back to list
            setTimeout(() => {
              this.successMessage = null;
              this.router.navigate(['/']);
            }, 700);
          },
          error: () => {
            this.isDeleting = false;
            // still navigate back
            this.router.navigate(['/']);
          }
        });
      },
      error: err => {
        this.isDeleting = false;
        console.error(err);
        alert('Failed to delete question');
      }
    });
  }
}
