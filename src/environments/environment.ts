/**
 * Environment template file.
 * This file is versioned and serves as documentation for required variables.
 *
 * The OpenAI API key is now handled server-side via the OPENAI_API_KEY environment variable.
 */
export const environment = {
  production: false,
  openaiModel: 'gpt-4o',
  openaiApiUrl: '/api/chat/completions',
  dalleModel: 'dall-e-3',
  dalleApiUrl: '/api/images/generations',
};
