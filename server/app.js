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

  // prefer explicit env var; allow a development fallback to localhost
  let MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!MONGO_URI) {
    if (process.env.NODE_ENV === 'production') {
      // fail fast in production
      throw new Error('MONGO_URI environment variable is not set');
    }
    // development: fall back to local mongodb but warn loudly
    MONGO_URI = 'mongodb://localhost:27017/interview';
    console.warn('MONGO_URI not set — falling back to', MONGO_URI);
  }

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

// helper to forward async errors to express error middleware
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// route handlers (wrapped with asyncHandler so errors go to the error handler)
app.get(
  '/public/getAllQuestionsWithAnswers',
  asyncHandler(async (req, res) => {
    await connectToMongo();
    const qs = await Question.find();
    res.json(qs);
  })
);

app.get(
  '/public/questions/:id',
  asyncHandler(async (req, res) => {
    await connectToMongo();
    const q = await Question.findById(req.params.id);
    if (q) return res.json(q);
    res.status(404).json({ error: 'Not found' });
  })
);

app.post(
  '/public/submitQuestion',
  asyncHandler(async (req, res) => {
    await connectToMongo();
    const { question, answer, technology } = req.body;
    if (!question || !answer || !technology) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const newQ = await Question.create({ question, answer, technology });
    res.status(201).json(newQ);
  })
);

app.put(
  '/public/questions/edit/:id',
  asyncHandler(async (req, res) => {
    await connectToMongo();
    const { question, answer, technology } = req.body;
    const q = await Question.findByIdAndUpdate(
      req.params.id,
      { question, answer, technology },
      { new: true }
    );
    if (!q) return res.status(404).json({ error: 'Not found' });
    res.json(q);
  })
);

app.delete(
  '/public/questions/delete/:id',
  asyncHandler(async (req, res) => {
    await connectToMongo();
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(200);
  })
);

// centralized error handler - must come after routes
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
