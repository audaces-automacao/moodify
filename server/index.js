import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { join } from 'path';
import { fileURLToPath } from 'url';
import {
  applyMiddleware,
  createApiLimiter,
  createAuthLimiter,
  createAuthMiddleware,
  createCorsOptions,
  createErrorHandler,
  createOpenAIProxy,
  createValidationMiddleware,
  validateChatRequest,
  validateImageRequest,
  validateLoginRequest,
} from './middleware.js';

export function createApp({ jwtSecret, openaiApiKey, allowedOrigins, validUser, staticPath } = {}) {
  if (!jwtSecret) throw new Error('jwtSecret is required');
  if (!openaiApiKey) throw new Error('openaiApiKey is required');
  if (!validUser?.email || !validUser?.password || !validUser?.sub) {
    throw new Error('validUser must include email, password, and sub');
  }

  const app = express();

  const corsOptions = createCorsOptions(allowedOrigins);
  const authMiddleware = createAuthMiddleware(jwtSecret);
  const authLimiter = createAuthLimiter();
  const apiLimiter = createApiLimiter();

  applyMiddleware(app, corsOptions);

  // Auth endpoints (no auth required)
  app.post(
    '/api/auth/login',
    authLimiter,
    createValidationMiddleware(validateLoginRequest, 'Email and password are required'),
    (req, res) => {
      const { email, password } = req.body;

      if (email === validUser.email && password === validUser.password) {
        const token = jwt.sign({ email, sub: validUser.sub }, jwtSecret, { expiresIn: '1d' });
        return res.json({ token, email });
      }

      return res.status(401).json({ error: 'Invalid credentials' });
    }
  );

  app.get('/api/auth/verify', authMiddleware, apiLimiter, (req, res) => {
    res.json({ valid: true, email: req.user.email });
  });

  // Proxy endpoints (protected, rate-limited)
  app.post(
    '/api/chat/completions',
    authMiddleware,
    apiLimiter,
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
    apiLimiter,
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

  app.use(createErrorHandler());

  return app;
}

export function startServer(
  env = process.env,
  {
    exit = process.exit,
    listen = (app, port, cb) => app.listen(port, cb),
    staticPath,
    dirname = import.meta.dirname,
  } = {}
) {
  const {
    PORT = 3000,
    OPENAI_API_KEY,
    JWT_SECRET,
    AUTH_EMAIL,
    AUTH_PASSWORD,
    AUTH_SUB,
    ALLOWED_ORIGINS,
  } = env;

  const required = { OPENAI_API_KEY, JWT_SECRET, AUTH_EMAIL, AUTH_PASSWORD };
  for (const [key, val] of Object.entries(required)) {
    if (!val) {
      console.error(`FATAL: ${key} environment variable is required`);
      exit(1);
      return;
    }
  }

  const allowedOrigins = ALLOWED_ORIGINS?.split(',');

  const app = createApp({
    jwtSecret: JWT_SECRET,
    openaiApiKey: OPENAI_API_KEY,
    allowedOrigins,
    validUser: { email: AUTH_EMAIL, password: AUTH_PASSWORD, sub: AUTH_SUB || 'default' },
    staticPath: staticPath ?? join(dirname, '../dist/moodify/browser'),
  });

  listen(app, PORT, () => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
  });
}

export function bootstrap({
  isMain = process.argv[1] === fileURLToPath(import.meta.url),
  dirname = import.meta.dirname,
  config = dotenv.config,
  start = startServer,
} = {}) {
  if (!isMain) return;
  config({ path: join(dirname, '../.env') });
  start(undefined, { dirname });
}

bootstrap();
