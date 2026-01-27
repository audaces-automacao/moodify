import express from 'express';
import compression from 'compression';
import jwt from 'jsonwebtoken';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
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

// Middleware
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// Auth endpoints (no auth required)
app.post('/api/auth/login', (req, res) => {
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

// Proxy endpoint for chat completions (protected)
app.post('/api/chat/completions', authMiddleware, async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Chat completions proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
  }
});

// Proxy endpoint for image generation (protected)
app.post('/api/images/generations', authMiddleware, async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Image generation proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
  }
});

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
