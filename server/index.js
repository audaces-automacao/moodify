import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { join } from 'path';
import { fileURLToPath } from 'url';
import {
  applyMiddleware,
  createAuthLimiter,
  createAuthMiddleware,
  createCorsOptions,
  createOpenAIProxy,
  createValidationMiddleware,
  validateChatRequest,
  validateImageRequest,
} from './middleware.js';

const DEFAULT_USER = {
  email: 'bob@audaces.com',
  password: '12345',
  sub: 'bob',
};

export function createApp({
  jwtSecret,
  openaiApiKey,
  allowedOrigins,
  validUser = DEFAULT_USER,
  staticPath,
} = {}) {
  if (!jwtSecret) throw new Error('jwtSecret is required');
  if (!openaiApiKey) throw new Error('openaiApiKey is required');
  if (!validUser?.email || !validUser?.password || !validUser?.sub) {
    throw new Error('validUser must include email, password, and sub');
  }

  const app = express();

  const corsOptions = createCorsOptions(allowedOrigins);
  const authMiddleware = createAuthMiddleware(jwtSecret);
  const authLimiter = createAuthLimiter();

  applyMiddleware(app, corsOptions);

  // Auth endpoints (no auth required)
  app.post('/api/auth/login', authLimiter, (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (email === validUser.email && password === validUser.password) {
      const token = jwt.sign({ email, sub: validUser.sub }, jwtSecret, { expiresIn: '1d' });
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
    createValidationMiddleware(
      validateChatRequest,
      'Invalid chat request: messages array with role and content required'
    ),
    createOpenAIProxy(
      openaiApiKey,
      'https://api.openai.com/v1/chat/completions',
      'Chat completions'
    )
  );

  app.post(
    '/api/images/generations',
    authMiddleware,
    createValidationMiddleware(
      validateImageRequest,
      'Invalid image request: prompt string required'
    ),
    createOpenAIProxy(
      openaiApiKey,
      'https://api.openai.com/v1/images/generations',
      'Image generation'
    )
  );

  // API 404 — must precede SPA fallback to avoid returning HTML for unknown API routes
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  if (staticPath) {
    app.use(express.static(staticPath));
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: staticPath });
    });
  }

  return app;
}

// Entry point: load env and start server
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const __dirname = import.meta.dirname;
  dotenv.config({ path: join(__dirname, '../.env') });

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

  const app = createApp({
    jwtSecret: JWT_SECRET,
    openaiApiKey: OPENAI_API_KEY,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(','),
    staticPath: join(__dirname, '../dist/moodify/browser'),
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
