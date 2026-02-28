// this file is now a thin bootstrap; the main app logic lives in ./app.js
import dotenv from 'dotenv';
import app from './app.js';

// load environment variables from .env (ignored in git)
dotenv.config();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
