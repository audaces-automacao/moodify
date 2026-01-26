import express from 'express';
import compression from 'compression';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('FATAL: OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

// Middleware
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// Proxy endpoint for chat completions
app.post('/api/chat/completions', async (req, res) => {
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

// Proxy endpoint for image generation
app.post('/api/images/generations', async (req, res) => {
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
