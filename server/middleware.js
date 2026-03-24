import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';

const HELMET_CONFIG = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://oaidalleapiprodscus.blob.core.windows.net'],
      connectSrc: ["'self'"],
    },
  },
};

export function createAuthMiddleware(secret) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

export function validateChatRequest(body) {
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) return false;
  return body.messages.every(m => typeof m.role === 'string' && typeof m.content === 'string');
}

export function validateImageRequest(body) {
  if (!body || typeof body.prompt !== 'string' || body.prompt.trim() === '') return false;
  if (body.n !== undefined && typeof body.n !== 'number') return false;
  if (body.size !== undefined && typeof body.size !== 'string') return false;
  return true;
}

export function validateLoginRequest(body) {
  if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') return false;
  return body.email.length > 0 && body.password.length > 0;
}

export function createAuthLimiter({ windowMs = 15 * 60 * 1000, max = 5 } = {}) {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many login attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export function createApiLimiter({ windowMs = 60 * 1000, max = 20 } = {}) {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export function createCorsOptions(allowedOrigins) {
  return {
    origin: allowedOrigins || ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
  };
}

export function applyMiddleware(app, corsOptions) {
  app.use(helmet(HELMET_CONFIG));
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
}

export function createValidationMiddleware(validatorFn, errorMessage = 'Invalid request body') {
  return (req, res, next) => {
    if (!validatorFn(req.body)) {
      return res.status(400).json({ error: errorMessage });
    }
    next();
  };
}

export function createOpenAIProxy(apiKey, url, label, { fetchFn = fetch, timeoutMs = 30000 } = {}) {
  return async (req, res) => {
    try {
      const response = await fetchFn(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(timeoutMs),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        console.error(`${label} upstream error: non-JSON response (HTTP ${response.status})`);
        return res.status(502).json({ error: `${label}: upstream returned non-JSON response` });
      }
      res.status(response.status).json(data);
    } catch (error) {
      console.error(`${label} proxy error:`, error);
      if (error.name === 'TimeoutError') {
        return res.status(504).json({ error: `${label} timed out` });
      }
      res.status(500).json({ error: `${label} failed` });
    }
  };
}

export function createErrorHandler() {
  return (err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  };
}
