# Questions Backend API

A minimal Node.js/Express backend for questions CRUD.

## Endpoints

- `GET /public/getAllQuestionsWithAnswers` — List all questions
- `GET /public/questions/:id` — Get question by id
- `POST /public/submitQuestion` — Add new question (fields: question, answer, technology)
- `PUT /public/questions/edit/:id` — Update question by id
- `DELETE /public/questions/delete/:id` — Delete question by id

## Quick Start

```powershell
cd d:\SELF\server
npm install
npm start
```

Server runs on http://localhost:8080

## Notes
- Data is stored in-memory (no DB). Restarting the server will reset questions.
- For production, replace with a database (MongoDB, Postgres, etc).
