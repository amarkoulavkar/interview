import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
 
import { Editor, NgxEditorModule, NgxEditorMenuComponent } from 'ngx-editor';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule, NgxEditorMenuComponent],
  template: `
    <div class="container py-3">
       
    </div>
  `,
 
})
export class AddQuestionComponent implements OnInit, OnDestroy {
 


  constructor(private fb: FormBuilder , private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    
  }
 

  ngOnDestroy(): void {
    
  }
}
