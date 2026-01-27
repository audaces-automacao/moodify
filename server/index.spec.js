import request from 'supertest';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

// Test configuration
const JWT_SECRET = 'test-secret';
const VALID_USER = {
  email: 'bob@audaces.com',
  password: '12345',
};

// Create test app (mirrors index.js structure)
function createTestApp() {
  const app = express();

  const corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
  };

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  function validateChatRequest(body) {
    if (!body || !Array.isArray(body.messages)) return false;
    return body.messages.every(
      (m) => typeof m.role === 'string' && typeof m.content === 'string',
    );
  }

  function validateImageRequest(body) {
    if (!body || typeof body.prompt !== 'string') return false;
    if (body.n !== undefined && typeof body.n !== 'number') return false;
    if (body.size !== undefined && typeof body.size !== 'string') return false;
    return true;
  }

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));

  // Auth endpoints
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

  // Mock OpenAI endpoints for testing validation
  app.post('/api/chat/completions', authMiddleware, (req, res) => {
    if (!validateChatRequest(req.body)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    res.json({ choices: [{ message: { content: 'Test response' } }] });
  });

  app.post('/api/images/generations', authMiddleware, (req, res) => {
    if (!validateImageRequest(req.body)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    res.json({ data: [{ url: 'https://example.com/image.png' }] });
  });

  return app;
}

describe('Server API', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /api/auth/login', () => {
    it('should return token for valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'bob@audaces.com', password: '12345' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe('bob@audaces.com');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'bob@audaces.com', password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: '12345' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });

    it('should return 400 for missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'bob@audaces.com' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });

    it('should return 400 for non-string email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 123, password: '12345' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should verify valid token', async () => {
      const token = jwt.sign({ email: 'bob@audaces.com', sub: 'bob' }, JWT_SECRET);

      const res = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(res.body.email).toBe('bob@audaces.com');
    });

    it('should return 401 for missing token', async () => {
      const res = await request(app).get('/api/auth/verify');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('No token provided');
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid or expired token');
    });

    it('should return 401 for malformed authorization header', async () => {
      const res = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'NotBearer token');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/chat/completions', () => {
    let validToken;

    beforeEach(() => {
      validToken = jwt.sign({ email: 'bob@audaces.com', sub: 'bob' }, JWT_SECRET);
    });

    it('should accept valid chat request', async () => {
      const res = await request(app)
        .post('/api/chat/completions')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          messages: [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: 'Hello' },
          ],
        });

      expect(res.status).toBe(200);
    });

    it('should reject request without messages array', async () => {
      const res = await request(app)
        .post('/api/chat/completions')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ prompt: 'Hello' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid request body');
    });

    it('should reject request with invalid message format', async () => {
      const res = await request(app)
        .post('/api/chat/completions')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          messages: [{ role: 123, content: 'Hello' }],
        });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/chat/completions')
        .send({ messages: [{ role: 'user', content: 'Hello' }] });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/images/generations', () => {
    let validToken;

    beforeEach(() => {
      validToken = jwt.sign({ email: 'bob@audaces.com', sub: 'bob' }, JWT_SECRET);
    });

    it('should accept valid image request', async () => {
      const res = await request(app)
        .post('/api/images/generations')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ prompt: 'A beautiful sunset', n: 1, size: '1024x1024' });

      expect(res.status).toBe(200);
    });

    it('should accept request with only prompt', async () => {
      const res = await request(app)
        .post('/api/images/generations')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ prompt: 'A beautiful sunset' });

      expect(res.status).toBe(200);
    });

    it('should reject request without prompt', async () => {
      const res = await request(app)
        .post('/api/images/generations')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ n: 1 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid request body');
    });

    it('should reject request with non-string prompt', async () => {
      const res = await request(app)
        .post('/api/images/generations')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ prompt: 123 });

      expect(res.status).toBe(400);
    });

    it('should reject request with non-number n', async () => {
      const res = await request(app)
        .post('/api/images/generations')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ prompt: 'Test', n: 'one' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/images/generations')
        .send({ prompt: 'A beautiful sunset' });

      expect(res.status).toBe(401);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from helmet', async () => {
      const res = await request(app).get('/api/auth/verify');

      // Helmet adds various security headers
      expect(res.headers).toHaveProperty('x-content-type-options');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('CORS', () => {
    it('should allow requests from configured origins', async () => {
      const res = await request(app)
        .options('/api/auth/login')
        .set('Origin', 'http://localhost:4200');

      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:4200');
    });
  });
});
