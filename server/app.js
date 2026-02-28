import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// express application instance with routes
const app = express();
app.use(cors());
app.use(bodyParser.json());

// mongo connection helper (reuse across Cold starts)
let isConnected = false;
async function connectToMongo() {
  if (isConnected) {
    // already connected, nothing to do
    return;
  }

  const MONGO_URI =
    process.env.MONGO_URI || process.env.MONGODB_URI ||
    'mongodb://localhost:27017/interview';

  // mongoose 6+ no longer needs or supports useNewUrlParser/useUnifiedTopology
  await mongoose.connect(MONGO_URI);
  isConnected = true;
  console.log(`MongoDB connected to ${MONGO_URI}`);
}

// define schema/model once (mongoose caches models by name)
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    technology: { type: String, required: true },
  },
  { timestamps: true }
);

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

// route handlers
app.get('/public/getAllQuestionsWithAnswers', async (req, res) => {
  await connectToMongo();
  const qs = await Question.find();
  res.json(qs);
});

app.get('/public/questions/:id', async (req, res) => {
  await connectToMongo();
  const q = await Question.findById(req.params.id);
  if (q) return res.json(q);
  res.status(404).json({ error: 'Not found' });
});

app.post('/public/submitQuestion', async (req, res) => {
  await connectToMongo();
  const { question, answer, technology } = req.body;
  if (!question || !answer || !technology) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const newQ = await Question.create({ question, answer, technology });
  res.status(201).json(newQ);
});

app.put('/public/questions/edit/:id', async (req, res) => {
  await connectToMongo();
  const { question, answer, technology } = req.body;
  const q = await Question.findByIdAndUpdate(
    req.params.id,
    { question, answer, technology },
    { new: true }
  );
  if (!q) return res.status(404).json({ error: 'Not found' });
  res.json(q);
});

app.delete('/public/questions/delete/:id', async (req, res) => {
  await connectToMongo();
  const q = await Question.findByIdAndDelete(req.params.id);
  if (!q) return res.status(404).json({ error: 'Not found' });
  res.sendStatus(200);
});

export default app;
