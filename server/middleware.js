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
  if (!body || !Array.isArray(body.messages)) return false;
  return body.messages.every(m => typeof m.role === 'string' && typeof m.content === 'string');
}

export function validateImageRequest(body) {
  if (!body || typeof body.prompt !== 'string') return false;
  if (body.n !== undefined && typeof body.n !== 'number') return false;
  if (body.size !== undefined && typeof body.size !== 'string') return false;
  return true;
}

export function createAuthLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts, please try again later' },
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

export function createOpenAIProxy(apiKey, url, label) {
  return async (req, res) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error(`${label} proxy error:`, error);
      res.status(500).json({ error: 'Proxy error' });
    }
  };
}
