import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import {
  createAuthMiddleware,
  createCorsOptions,
  createOpenAIProxy,
  validateChatRequest,
  validateImageRequest,
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

  it('should accept empty messages array', () => {
    expect(validateChatRequest({ messages: [] })).toBe(true);
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
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Proxy error' });
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
