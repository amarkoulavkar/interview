import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

// In-memory store for demo
let questions = [
  {
    id: '6911e16ccab2e80952c4cecf',
    question: 'What is this',
    answer: 'this is nothing',
    technology: 'java'
  },
  {
    id: 'a1b2c3d4e5f60123456789ab',
    question: 'How do I create a REST endpoint in Express?',
    answer: 'Use app.get/post/put/delete with a route path and a handler function; parse JSON with body-parser or express.json().',
    technology: 'nodejs'
  },
  {
    id: 'b2c3d4e5f60123456789ab1c',
    question: 'What is Angular standalone component?',
    answer: 'A standalone component is an Angular component that does not need to be declared in an NgModule and can be bootstrapped or imported directly.',
    technology: 'angular'
  },
  {
    id: 'c3d4e5f60123456789ab1c2',
    question: 'How to prevent SQL injection?',
    answer: 'Use parameterized queries/prepared statements or ORM query builders instead of string concatenation to safely include user input.',
    technology: 'sql'
  },
  {
    id: 'd4e5f60123456789ab1c2d3',
    question: 'What is event loop in JavaScript?',
    answer: 'The event loop is the mechanism that handles asynchronous callbacks by polling the message queue and executing tasks when the call stack is empty.',
    technology: 'javascript'
  },
  {
    id: 'e5f60123456789ab1c2d3e4',
    question: 'How do I manage virtual environments in Python?',
    answer: 'Use venv or virtualenv to create isolated environments and pip to install project-specific dependencies.',
    technology: 'python'
  },
  {
    id: 'f60123456789ab1c2d3e4f5',
    question: 'What is CI/CD?',
    answer: 'CI/CD stands for Continuous Integration and Continuous Deployment: automated build/test pipelines (CI) and automated deployment pipelines (CD).',
    technology: 'devops'
  }
];

// GET all questions
app.get('/public/getAllQuestionsWithAnswers', (req, res) => {
  res.json(questions);
});

// GET question by id
app.get('/public/questions/:id', (req, res) => {
  const q = questions.find(q => q.id === req.params.id);
  if (q) return res.json(q);
  res.status(404).json({ error: 'Not found' });
});

// POST submit new question
app.post('/public/submitQuestion', (req, res) => {
  const { question, answer, technology } = req.body;
  if (!question || !answer || !technology) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const newQ = { id: uuidv4(), question, answer, technology };
  questions.push(newQ);
  res.status(201).json(newQ);
});

// PUT update question by id
app.put('/public/questions/edit/:id', (req, res) => {
  const idx = questions.findIndex(q => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { question, answer, technology } = req.body;
  questions[idx] = { ...questions[idx], question, answer, technology };
  res.json(questions[idx]);
});

// DELETE question by id
app.delete('/public/questions/delete/:id', (req, res) => {
  const idx = questions.findIndex(q => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  questions.splice(idx, 1);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
