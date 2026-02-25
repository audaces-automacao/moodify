import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  applyMiddleware,
  createAuthLimiter,
  createAuthMiddleware,
  createCorsOptions,
  createOpenAIProxy,
  validateChatRequest,
  validateImageRequest,
} from './middleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from project root
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

if (!OPENAI_API_KEY) {
  console.error('FATAL: OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}

const VALID_USER = {
  email: 'bob@audaces.com',
  password: '12345',
};

const corsOptions = createCorsOptions(process.env.ALLOWED_ORIGINS?.split(','));
const authMiddleware = createAuthMiddleware(JWT_SECRET);
const authLimiter = createAuthLimiter();

// Middleware
applyMiddleware(app, corsOptions);

// Auth endpoints (no auth required)
app.post('/api/auth/login', authLimiter, (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (email === VALID_USER.email && password === VALID_USER.password) {
    const token = jwt.sign({ email, sub: 'bob' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, email });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, email: req.user.email });
});

// Proxy endpoints (protected)
app.post(
  '/api/chat/completions',
  authMiddleware,
  (req, res, next) => {
    if (!validateChatRequest(req.body)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    next();
  },
  createOpenAIProxy(
    OPENAI_API_KEY,
    'https://api.openai.com/v1/chat/completions',
    'Chat completions'
  )
);

app.post(
  '/api/images/generations',
  authMiddleware,
  (req, res, next) => {
    if (!validateImageRequest(req.body)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    next();
  },
  createOpenAIProxy(
    OPENAI_API_KEY,
    'https://api.openai.com/v1/images/generations',
    'Image generation'
  )
);

// Serve static files
const staticPath = join(__dirname, '../dist/moodify/browser');
app.use(express.static(staticPath));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
