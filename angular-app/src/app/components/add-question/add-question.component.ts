import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { Editor, NgxEditorModule, NgxEditorMenuComponent } from 'ngx-editor';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule, NgxEditorMenuComponent],
  template: `
    <div class="container py-3">
      <div class="row justify-content-start">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">{{ isEdit ? 'Edit Question' : 'Add Question' }}</h5>
              <small class="text-muted">Fill all fields</small>
            </div>
            <div class="card-body">
              <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
                <div class="mb-3">
                  <label class="form-label">Technology</label>
                  <input class="form-control" formControlName="technology" placeholder="e.g. Java, Angular" />
                  <div *ngIf="form.controls['technology'].touched && form.controls['technology'].invalid" class="text-danger small mt-1">Technology is required.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Question</label>
                  <textarea class="form-control" rows="3" formControlName="question" placeholder="Type the question"></textarea>
                  <div *ngIf="form.controls['question'].touched && form.controls['question'].invalid" class="text-danger small mt-1">Question is required.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Answer</label>
                  <div class="mb-2">
                    <ngx-editor-menu [editor]="editor" [toolbar]="toolbar"></ngx-editor-menu>
                  </div>
                  <ngx-editor
                    [editor]="editor"
                    formControlName="answer"
                    [placeholder]="'Type your answer here...'"
                  ></ngx-editor>
                  <div *ngIf="form.controls['answer'].touched && form.controls['answer'].invalid" class="text-danger small mt-1">Answer is required.</div>
                </div>

                <div class="d-flex gap-2">
                  <button class="btn btn-primary" type="submit" [disabled]="form.invalid">{{ isEdit ? 'Update' : 'Add Question' }}</button>
                  <button class="btn btn-outline-secondary" type="button" (click)="cancel()">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `:host { display:block; }
    .card { border-radius:8px; }
    .card-header { background:#f8f9fa; }
    .text-danger { font-size:0.85rem; }
    `
  ]
})
export class AddQuestionComponent implements OnInit, OnDestroy {
  editor: Editor;
  toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['ordered_list', 'bullet_list'],
    ['code', 'blockquote'],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['undo', 'redo'],
    ['remove_format'],
  ];
  form = this.fb.group({
    technology: ['', Validators.required],
    question: ['', Validators.required],
    answer: ['', Validators.required]
  });

  isEdit = false;
  editingId: string | null = null;


  constructor(private fb: FormBuilder, private qs: QuestionService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.editor = new Editor();
    // detect route param for edit (use snapshot first, then subscribe to changes)
    const idSnapshot = this.route.snapshot.paramMap.get('id');
    if (idSnapshot) {
      this.loadForEdit(idSnapshot);
    }

    // also react to param changes
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (id) {
        this.loadForEdit(id);
      } else {
        this.isEdit = false;
        this.editingId = null;
      }
    });
  }

  private loadForEdit(id: string) {
    this.isEdit = true;
    this.editingId = id;
    this.qs.getQuestion(id).subscribe({ next: q => this.form.patchValue({ technology: q.technology, question: q.question, answer: q.answer }), error: () => {} });
  }

  submit() {
    if (this.form.invalid) return;
    if (this.isEdit && this.editingId) {
      this.qs.updateQuestion(this.editingId, this.form.value).subscribe({
        next: q => this.router.navigate(['/question', q.id]),
        error: err => console.error(err)
      });
    } else {
      this.qs.addQuestion(this.form.value).subscribe({
        next: q => this.router.navigate(['/question', q.id]),
        error: err => console.error(err)
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
