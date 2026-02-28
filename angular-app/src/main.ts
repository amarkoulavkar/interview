import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { QuestionDetailComponent } from './app/components/question-detail/question-detail.component';
import { AddQuestionComponent } from './app/components/add-question/add-question.component';

const routes: Routes = [
  // put the edit route before the detail route so '/question/:id/edit' matches the edit component
  { path: 'question/:id/edit', component: AddQuestionComponent },
  { path: 'question/:id', component: QuestionDetailComponent },
  { path: 'add', component: AddQuestionComponent },
  { path: '', redirectTo: 'add', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule, HttpClientModule, RouterModule.forRoot(routes))]
}).catch(err => console.error(err));
