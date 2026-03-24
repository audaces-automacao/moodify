import { jest } from '@jest/globals';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import jwt from 'jsonwebtoken';
import { tmpdir } from 'os';
import { join } from 'path';
import request from 'supertest';
import { createApp, startServer } from './index.js';

const JWT_SECRET = 'test-secret';
const TEST_USER = { email: 'bob@audaces.com', password: '12345', sub: 'bob' };

const VALID_ENV = {
  OPENAI_API_KEY: 'test-key',
  JWT_SECRET: 'test-secret',
  AUTH_EMAIL: 'bob@audaces.com',
  AUTH_PASSWORD: '12345',
};

describe('Server API', () => {
  let app;
  let validToken;

  beforeEach(() => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Test response' } }] }),
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    app = createApp({ jwtSecret: JWT_SECRET, openaiApiKey: 'test-api-key', validUser: TEST_USER });
    validToken = jwt.sign({ email: 'bob@audaces.com', sub: 'bob' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
      const res = await request(app).post('/api/auth/login').send({ password: '12345' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });

    it('should return 400 for missing password', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'bob@audaces.com' });

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
      const res = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${validToken}`);

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
    it('should accept valid chat request and forward to OpenAI', async () => {
      const body = {
        messages: [
          { role: 'system', content: 'You are a helpful assistant' },
          { role: 'user', content: 'Hello' },
        ],
      };

      const res = await request(app)
        .post('/api/chat/completions')
        .set('Authorization', `Bearer ${validToken}`)
        .send(body);

      expect(res.status).toBe(200);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
          body: JSON.stringify(body),
        })
      );
    });

    it('should reject request without messages array', async () => {
      const res = await request(app)
        .post('/api/chat/completions')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ prompt: 'Hello' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        'Invalid chat request: messages array with role and content required'
      );
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

    it('should return 500 when OpenAI fetch fails', async () => {
      globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

      const res = await request(app)
        .post('/api/chat/completions')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ messages: [{ role: 'user', content: 'Hello' }] });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Chat completions failed');
    });

    it('should forward non-200 status from OpenAI', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        status: 429,
        json: () => Promise.resolve({ error: { message: 'Rate limit exceeded' } }),
      });

      const res = await request(app)
        .post('/api/chat/completions')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ messages: [{ role: 'user', content: 'Hello' }] });

      expect(res.status).toBe(429);
      expect(res.body.error.message).toBe('Rate limit exceeded');
    });
  });

  describe('POST /api/images/generations', () => {
    it('should accept valid image request and forward to OpenAI', async () => {
      const body = { prompt: 'A beautiful sunset', n: 1, size: '1024x1024' };

      const res = await request(app)
        .post('/api/images/generations')
        .set('Authorization', `Bearer ${validToken}`)
        .send(body);

      expect(res.status).toBe(200);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/images/generations',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
          body: JSON.stringify(body),
        })
      );
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
      expect(res.body.error).toBe('Invalid image request: prompt string required');
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

    it('should return 500 when OpenAI fetch fails', async () => {
      globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

      const res = await request(app)
        .post('/api/images/generations')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ prompt: 'A beautiful sunset' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Image generation failed');
    });

    it('should forward non-200 status from OpenAI', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        status: 429,
        json: () => Promise.resolve({ error: { message: 'Rate limit exceeded' } }),
      });

      const res = await request(app)
        .post('/api/images/generations')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ prompt: 'A beautiful sunset' });

      expect(res.status).toBe(429);
      expect(res.body.error.message).toBe('Rate limit exceeded');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from helmet', async () => {
      const res = await request(app).get('/api/auth/verify');

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

  describe('API 404', () => {
    it('should return JSON 404 for unknown API routes', async () => {
      const res = await request(app).get('/api/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });
  });

  describe('createApp configuration', () => {
    it('should throw when jwtSecret is missing', () => {
      expect(() => createApp({ openaiApiKey: 'key' })).toThrow('jwtSecret is required');
    });

    it('should throw when openaiApiKey is missing', () => {
      expect(() => createApp({ jwtSecret: 'secret' })).toThrow('openaiApiKey is required');
    });

    it('should throw when validUser is missing email', () => {
      expect(() =>
        createApp({
          jwtSecret: 'secret',
          openaiApiKey: 'key',
          validUser: { password: '123', sub: 'test' },
        })
      ).toThrow('validUser must include email, password, and sub');
    });

    it('should throw when validUser is missing password', () => {
      expect(() =>
        createApp({
          jwtSecret: 'secret',
          openaiApiKey: 'key',
          validUser: { email: 'a@b.com', sub: 'test' },
        })
      ).toThrow('validUser must include email, password, and sub');
    });

    it('should throw when validUser is missing sub', () => {
      expect(() =>
        createApp({
          jwtSecret: 'secret',
          openaiApiKey: 'key',
          validUser: { email: 'a@b.com', password: '123' },
        })
      ).toThrow('validUser must include email, password, and sub');
    });
  });

  describe('Static file serving', () => {
    let staticDir;

    beforeEach(() => {
      staticDir = mkdtempSync(join(tmpdir(), 'moodify-test-'));
      writeFileSync(join(staticDir, 'index.html'), '<html><body>SPA</body></html>');
      writeFileSync(join(staticDir, 'style.css'), 'body { color: red; }');
    });

    afterEach(() => {
      rmSync(staticDir, { recursive: true, force: true });
    });

    it('should serve static files when staticPath is provided', async () => {
      const staticApp = createApp({
        jwtSecret: JWT_SECRET,
        openaiApiKey: 'test-api-key',
        validUser: TEST_USER,
        staticPath: staticDir,
      });

      const res = await request(staticApp).get('/style.css');

      expect(res.status).toBe(200);
      expect(res.text).toContain('body { color: red; }');
    });

    it('should serve index.html as SPA fallback for unknown routes', async () => {
      const staticApp = createApp({
        jwtSecret: JWT_SECRET,
        openaiApiKey: 'test-api-key',
        validUser: TEST_USER,
        staticPath: staticDir,
      });

      const res = await request(staticApp).get('/some/client/route');

      expect(res.status).toBe(200);
      expect(res.text).toContain('SPA');
    });

    it('should still return JSON 404 for unknown API routes with static serving', async () => {
      const staticApp = createApp({
        jwtSecret: JWT_SECRET,
        openaiApiKey: 'test-api-key',
        validUser: TEST_USER,
        staticPath: staticDir,
      });

      const res = await request(staticApp).get('/api/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });
  });
});

describe('startServer', () => {
  const VALID_ENV = {
    OPENAI_API_KEY: 'test-key',
    JWT_SECRET: 'test-secret',
    AUTH_EMAIL: 'bob@audaces.com',
    AUTH_PASSWORD: '12345',
  };

  let exit;
  let listen;
  let deps;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    exit = jest.fn();
    listen = jest.fn();
    deps = { exit, listen, staticPath: '/tmp/test' };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should exit with 1 when OPENAI_API_KEY is missing', () => {
    startServer({ ...VALID_ENV, OPENAI_API_KEY: '' }, deps);

    expect(exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      'FATAL: OPENAI_API_KEY environment variable is required'
    );
    expect(listen).not.toHaveBeenCalled();
  });

  it('should exit with 1 when JWT_SECRET is missing', () => {
    startServer({ ...VALID_ENV, JWT_SECRET: '' }, deps);

    expect(exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      'FATAL: JWT_SECRET environment variable is required'
    );
    expect(listen).not.toHaveBeenCalled();
  });

  it('should exit with 1 when AUTH_EMAIL is missing', () => {
    startServer({ ...VALID_ENV, AUTH_EMAIL: '' }, deps);

    expect(exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      'FATAL: AUTH_EMAIL environment variable is required'
    );
    expect(listen).not.toHaveBeenCalled();
  });

  it('should exit with 1 when AUTH_PASSWORD is missing', () => {
    startServer({ ...VALID_ENV, AUTH_PASSWORD: '' }, deps);

    expect(exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      'FATAL: AUTH_PASSWORD environment variable is required'
    );
    expect(listen).not.toHaveBeenCalled();
  });

  it('should call listen with default port 3000 when PORT is not set', () => {
    startServer(VALID_ENV, deps);

    expect(exit).not.toHaveBeenCalled();
    expect(listen).toHaveBeenCalledWith(expect.anything(), 3000, expect.any(Function));
  });

  it('should call listen with custom PORT from env', () => {
    startServer({ ...VALID_ENV, PORT: 8080 }, deps);

    expect(exit).not.toHaveBeenCalled();
    expect(listen).toHaveBeenCalledWith(expect.anything(), 8080, expect.any(Function));
  });

  it('should parse ALLOWED_ORIGINS as comma-separated list', () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ status: 200, json: () => Promise.resolve({}) });

    startServer({ ...VALID_ENV, ALLOWED_ORIGINS: 'https://a.com,https://b.com' }, deps);

    expect(exit).not.toHaveBeenCalled();
    expect(listen).toHaveBeenCalled();
  });

  it('should use AUTH_SUB fallback when not provided', () => {
    startServer(VALID_ENV, deps);

    expect(exit).not.toHaveBeenCalled();
    expect(listen).toHaveBeenCalled();
  });

  it('should use custom AUTH_SUB from env', () => {
    startServer({ ...VALID_ENV, AUTH_SUB: 'custom-sub' }, deps);

    expect(exit).not.toHaveBeenCalled();
    expect(listen).toHaveBeenCalled();
  });

  it('should log listening message when listen callback fires', () => {
    startServer(VALID_ENV, deps);

    const callback = listen.mock.calls[0][2];
    callback();

    expect(console.log).toHaveBeenCalledWith('Server listening on 0.0.0.0:3000');
  });
});
