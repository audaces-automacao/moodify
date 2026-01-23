/**
 * Environment template file - DO NOT add real API keys here.
 * This file is versioned and serves as documentation for required variables.
 *
 * For local development, create environment.development.ts with your real keys.
 * For production builds, create environment.prod.ts with production keys.
 */
export const environment = {
  production: false,
  openaiApiKey: 'REPLACE_WITH_YOUR_OPENAI_API_KEY',
  openaiModel: 'gpt-4o',
  openaiApiUrl: 'https://api.openai.com/v1/chat/completions',
};
