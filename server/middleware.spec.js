import { jest } from '@jest/globals';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
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

const JWT_SECRET = 'test-secret';

describe('validateChatRequest', () => {
  it('should accept valid messages array', () => {
    expect(
      validateChatRequest({
        messages: [{ role: 'user', content: 'Hello' }],
      })
    ).toBe(true);
  });

  it('should accept multiple messages', () => {
    expect(
      validateChatRequest({
        messages: [
          { role: 'system', content: 'You are helpful' },
          { role: 'user', content: 'Hi' },
        ],
      })
    ).toBe(true);
  });

  it('should reject null body', () => {
    expect(validateChatRequest(null)).toBe(false);
  });

  it('should reject undefined body', () => {
    expect(validateChatRequest(undefined)).toBe(false);
  });

  it('should reject missing messages', () => {
    expect(validateChatRequest({})).toBe(false);
  });

  it('should reject non-array messages', () => {
    expect(validateChatRequest({ messages: 'not-array' })).toBe(false);
  });

  it('should reject message with non-string role', () => {
    expect(validateChatRequest({ messages: [{ role: 123, content: 'Hi' }] })).toBe(false);
  });

  it('should reject message with non-string content', () => {
    expect(validateChatRequest({ messages: [{ role: 'user', content: 42 }] })).toBe(false);
  });

  it('should reject message with missing role', () => {
    expect(validateChatRequest({ messages: [{ content: 'Hi' }] })).toBe(false);
  });

  it('should reject message with missing content', () => {
    expect(validateChatRequest({ messages: [{ role: 'user' }] })).toBe(false);
  });

  it('should reject empty messages array', () => {
    expect(validateChatRequest({ messages: [] })).toBe(false);
  });
});

describe('validateImageRequest', () => {
  it('should accept valid prompt', () => {
    expect(validateImageRequest({ prompt: 'A sunset' })).toBe(true);
  });

  it('should accept prompt with n and size', () => {
    expect(validateImageRequest({ prompt: 'A sunset', n: 2, size: '1024x1024' })).toBe(true);
  });

  it('should reject null body', () => {
    expect(validateImageRequest(null)).toBe(false);
  });

  it('should reject undefined body', () => {
    expect(validateImageRequest(undefined)).toBe(false);
  });

  it('should reject missing prompt', () => {
    expect(validateImageRequest({})).toBe(false);
  });

  it('should reject non-string prompt', () => {
    expect(validateImageRequest({ prompt: 123 })).toBe(false);
  });

  it('should reject non-number n', () => {
    expect(validateImageRequest({ prompt: 'Test', n: 'one' })).toBe(false);
  });

  it('should reject non-string size', () => {
    expect(validateImageRequest({ prompt: 'Test', size: 1024 })).toBe(false);
  });

  it('should accept prompt with only n', () => {
    expect(validateImageRequest({ prompt: 'Test', n: 3 })).toBe(true);
  });

  it('should accept prompt with only size', () => {
    expect(validateImageRequest({ prompt: 'Test', size: '512x512' })).toBe(true);
  });

  it('should reject empty prompt', () => {
    expect(validateImageRequest({ prompt: '' })).toBe(false);
  });

  it('should reject whitespace-only prompt', () => {
    expect(validateImageRequest({ prompt: '   ' })).toBe(false);
  });
});

describe('createAuthMiddleware', () => {
  let authMiddleware;
  let mockRes;

  beforeEach(() => {
    authMiddleware = createAuthMiddleware(JWT_SECRET);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should call next for valid token', () => {
    const token = jwt.sign({ email: 'test@test.com', sub: 'test' }, JWT_SECRET);
    const mockReq = { headers: { authorization: `Bearer ${token}` } };
    const mockNext = jest.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.email).toBe('test@test.com');
  });

  it('should return 401 for missing authorization header', () => {
    const mockReq = { headers: {} };
    const mockNext = jest.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for non-Bearer authorization', () => {
    const mockReq = { headers: { authorization: 'Basic abc123' } };
    const mockNext = jest.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  it('should return 401 for invalid token', () => {
    const mockReq = { headers: { authorization: 'Bearer invalid-token' } };
    const mockNext = jest.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });

  it('should return 401 for Bearer with empty token', () => {
    const mockReq = { headers: { authorization: 'Bearer ' } };
    const mockNext = jest.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for expired token', () => {
    const token = jwt.sign({ email: 'test@test.com' }, JWT_SECRET, { expiresIn: '-1s' });
    const mockReq = { headers: { authorization: `Bearer ${token}` } };
    const mockNext = jest.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });

  it('should return 401 for token signed with wrong secret', () => {
    const token = jwt.sign({ email: 'test@test.com' }, 'wrong-secret');
    const mockReq = { headers: { authorization: `Bearer ${token}` } };
    const mockNext = jest.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });
});

describe('createCorsOptions', () => {
  it('should return default origins when none provided', () => {
    const options = createCorsOptions();
    expect(options.origin).toEqual(['http://localhost:4200', 'http://localhost:3000']);
    expect(options.credentials).toBe(true);
  });

  it('should return default origins for undefined', () => {
    const options = createCorsOptions(undefined);
    expect(options.origin).toEqual(['http://localhost:4200', 'http://localhost:3000']);
  });

  it('should use custom origins when provided', () => {
    const custom = ['https://example.com', 'https://app.example.com'];
    const options = createCorsOptions(custom);
    expect(options.origin).toEqual(custom);
    expect(options.credentials).toBe(true);
  });
});

describe('createOpenAIProxy', () => {
  let mockRes;

  beforeEach(() => {
    jest.spyOn(globalThis, 'fetch');
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should proxy request to OpenAI and return response', async () => {
    const mockData = { choices: [{ message: { content: 'Hello' } }] };
    globalThis.fetch.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockData),
    });

    const proxy = createOpenAIProxy(
      'test-api-key',
      'https://api.openai.com/v1/chat/completions',
      'Chat'
    );
    const mockReq = { body: { messages: [{ role: 'user', content: 'Hi' }] } };

    await proxy(mockReq, mockRes);

    expect(globalThis.fetch).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-api-key',
      },
      body: JSON.stringify(mockReq.body),
      signal: expect.any(AbortSignal),
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockData);
  });

  it('should forward error status from OpenAI', async () => {
    const errorData = { error: { message: 'Rate limited' } };
    globalThis.fetch.mockResolvedValue({
      status: 429,
      json: () => Promise.resolve(errorData),
    });

    const proxy = createOpenAIProxy('key', 'https://api.openai.com/v1/chat/completions', 'Chat');
    const mockReq = { body: {} };

    await proxy(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(429);
    expect(mockRes.json).toHaveBeenCalledWith(errorData);
  });

  it('should return 500 on fetch failure', async () => {
    globalThis.fetch.mockRejectedValue(new Error('Network error'));
    jest.spyOn(console, 'error').mockImplementation();

    const proxy = createOpenAIProxy('key', 'https://api.openai.com/v1/chat/completions', 'Chat');
    const mockReq = { body: {} };

    await proxy(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Chat failed' });
    expect(console.error).toHaveBeenCalledWith('Chat proxy error:', expect.any(Error));
  });

  it('should use correct API key in authorization header', async () => {
    globalThis.fetch.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({}),
    });

    const proxy = createOpenAIProxy(
      'sk-my-secret-key',
      'https://api.openai.com/v1/images/generations',
      'Images'
    );
    const mockReq = { body: { prompt: 'test' } };

    await proxy(mockReq, mockRes);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-my-secret-key',
        }),
      })
    );
  });
});

describe('createValidationMiddleware', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should call next when validator returns true', () => {
    const validator = jest.fn().mockReturnValue(true);
    const middleware = createValidationMiddleware(validator);
    const mockReq = { body: { data: 'valid' } };
    const mockNext = jest.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(validator).toHaveBeenCalledWith({ data: 'valid' });
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 400 when validator returns false', () => {
    const validator = jest.fn().mockReturnValue(false);
    const middleware = createValidationMiddleware(validator);
    const mockReq = { body: { data: 'invalid' } };
    const mockNext = jest.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(validator).toHaveBeenCalledWith({ data: 'invalid' });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid request body' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should work with validateChatRequest', () => {
    const middleware = createValidationMiddleware(validateChatRequest);
    const mockReq = { body: { messages: [{ role: 'user', content: 'Hi' }] } };
    const mockNext = jest.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject invalid chat request via middleware', () => {
    const middleware = createValidationMiddleware(validateChatRequest);
    const mockReq = { body: { prompt: 'not messages' } };
    const mockNext = jest.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('validateLoginRequest', () => {
  it('should accept valid email and password', () => {
    expect(validateLoginRequest({ email: 'bob@audaces.com', password: '12345' })).toBe(true);
  });

  it('should reject null body', () => {
    expect(validateLoginRequest(null)).toBe(false);
  });

  it('should reject undefined body', () => {
    expect(validateLoginRequest(undefined)).toBe(false);
  });

  it('should reject missing email', () => {
    expect(validateLoginRequest({ password: '12345' })).toBe(false);
  });

  it('should reject missing password', () => {
    expect(validateLoginRequest({ email: 'bob@audaces.com' })).toBe(false);
  });

  it('should reject empty email', () => {
    expect(validateLoginRequest({ email: '', password: '12345' })).toBe(false);
  });

  it('should reject empty password', () => {
    expect(validateLoginRequest({ email: 'bob@audaces.com', password: '' })).toBe(false);
  });

  it('should reject non-string email', () => {
    expect(validateLoginRequest({ email: 123, password: '12345' })).toBe(false);
  });

  it('should reject non-string password', () => {
    expect(validateLoginRequest({ email: 'bob@audaces.com', password: 123 })).toBe(false);
  });
});

describe('createErrorHandler', () => {
  it('should return 500 with generic error message', () => {
    const handler = createErrorHandler();
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.spyOn(console, 'error').mockImplementation();

    handler(new Error('boom'), {}, mockRes, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(console.error).toHaveBeenCalledWith('Unhandled error:', expect.any(Error));
    console.error.mockRestore();
  });
});

describe('createOpenAIProxy — non-JSON response', () => {
  let mockRes;

  beforeEach(() => {
    jest.spyOn(globalThis, 'fetch');
    jest.spyOn(console, 'error').mockImplementation();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return 502 when upstream returns non-JSON response', async () => {
    globalThis.fetch.mockResolvedValue({
      status: 200,
      json: () => Promise.reject(new Error('Unexpected token')),
    });

    const proxy = createOpenAIProxy('key', 'https://api.openai.com/v1/chat/completions', 'Chat');
    await proxy({ body: {} }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(502);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Chat: upstream returned non-JSON response',
    });
  });

  it('should return 504 when request times out', async () => {
    const timeoutError = new Error('The operation was aborted due to timeout');
    timeoutError.name = 'TimeoutError';
    globalThis.fetch.mockRejectedValue(timeoutError);

    const proxy = createOpenAIProxy('key', 'https://api.openai.com/v1/chat/completions', 'Chat');
    await proxy({ body: {} }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(504);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Chat timed out' });
  });
});

describe('createAuthLimiter', () => {
  it('should return a middleware function with default params', () => {
    const limiter = createAuthLimiter();
    expect(typeof limiter).toBe('function');
  });

  it('should accept custom windowMs and max', () => {
    const limiter = createAuthLimiter({ windowMs: 60000, max: 10 });
    expect(typeof limiter).toBe('function');
  });
});

describe('createApiLimiter', () => {
  it('should return a middleware function with default params', () => {
    const limiter = createApiLimiter();
    expect(typeof limiter).toBe('function');
  });

  it('should accept custom windowMs and max', () => {
    const limiter = createApiLimiter({ windowMs: 30000, max: 50 });
    expect(typeof limiter).toBe('function');
  });
});

describe('applyMiddleware', () => {
  it('should apply helmet, cors, compression, and JSON parser to the app', async () => {
    const app = express();
    const corsOptions = createCorsOptions();

    applyMiddleware(app, corsOptions);

    app.get('/test', (req, res) => res.json({ ok: true }));

    const res = await request(app).get('/test');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should parse JSON request bodies', async () => {
    const app = express();
    applyMiddleware(app, createCorsOptions());

    app.post('/echo', (req, res) => res.json(req.body));

    const res = await request(app).post('/echo').send({ hello: 'world' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hello: 'world' });
  });
});

describe('createOpenAIProxy — injectable fetchFn and timeoutMs', () => {
  it('should use injected fetchFn instead of global fetch', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ result: 'ok' }),
    });
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const proxy = createOpenAIProxy('key', 'https://api.openai.com/v1/test', 'Test', {
      fetchFn: mockFetch,
    });
    await proxy({ body: { prompt: 'hi' } }, mockRes);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/test',
      expect.objectContaining({ method: 'POST' })
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ result: 'ok' });
  });

  it('should pass custom timeoutMs to AbortSignal.timeout', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({}),
    });
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const proxy = createOpenAIProxy('key', 'https://api.openai.com/v1/test', 'Test', {
      fetchFn: mockFetch,
      timeoutMs: 5000,
    });
    await proxy({ body: {} }, mockRes);

    const callArgs = mockFetch.mock.calls[0][1];
    expect(callArgs.signal).toBeInstanceOf(AbortSignal);
  });
});
