import { environment } from '../../environments/environment';

export const API_ENDPOINTS = {
  GET_QUESTIONS: `${environment.apiBaseUrl}/public/getAllQuestionsWithAnswers`,
  GET_QUESTION: (id: string) => `${environment.apiBaseUrl}/public/questions/${id}`,
  ADD_QUESTION: `${environment.apiBaseUrl}/public/submitQuestion`,
  UPDATE_QUESTION: (id: string) => `${environment.apiBaseUrl}/public/questions/edit/${id}`,
  DELETE_QUESTION: (id: string) => `${environment.apiBaseUrl}/public/questions/delete/${id}`,
};
