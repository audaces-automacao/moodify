# Moodify - AI Fashion Mood Board Generator

An AI-powered web application that generates fashion mood boards based on style descriptions. Describe your style, occasion, or vibe and receive a curated mood board with color palettes, fabric recommendations, style keywords, and outfit suggestions.

## Features

- **AI-Powered Generation**: Uses OpenAI GPT-4 to create cohesive fashion mood boards
- **Color Palette**: 5-6 harmonious colors with hex codes and descriptions
- **Fabric Recommendations**: 3-4 fabric suggestions with texture details
- **Style Keywords**: 8-12 aesthetic descriptors
- **Outfit Suggestions**: Complete outfit with top, bottom, shoes, and accessories
- **Dark Luxury Theme**: Elegant, fashion-forward dark UI design

## Tech Stack

- Angular 21 (Standalone Components, Signal-based Inputs/Outputs)
- Tailwind CSS
- OpenAI GPT-4 API

## Getting Started

### Prerequisites

- Node.js 20+
- Angular CLI 21 (`npm install -g @angular/cli@21`)
- OpenAI API Key

### Installation

1. Clone the repository and install dependencies:
```bash
cd moodify
npm install
```

2. Configure your OpenAI API key:

Edit `src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  openaiApiKey: 'sk-your-api-key-here'
};
```

> **Security Note**: Never commit your API key. The `environment.development.ts` file is already in `.gitignore`.

3. Start the development server:
```bash
ng serve
```

4. Open your browser to `http://localhost:4200`

## Usage

1. Enter a description of your desired style, occasion, or fashion vibe in the text area
2. Or click one of the example prompts for inspiration
3. Click "Generate Mood Board" and wait for the AI to curate your results
4. View your personalized mood board with:
   - Aesthetic title and description
   - Color palette (click to copy hex codes)
   - Style keywords
   - Complete outfit suggestions
   - Fabric recommendations

## Project Structure

```
src/app/
├── components/
│   ├── aesthetic-description/    # Title and vibe description
│   ├── color-palette/            # Color swatches with hex codes
│   ├── error-message/            # Error display with retry
│   ├── example-prompts/          # Clickable prompt suggestions
│   ├── fabric-recommendations/   # Fabric cards
│   ├── loading-spinner/          # Loading animation
│   ├── mood-board-display/       # Main display container
│   ├── mood-board-input/         # Text input and submit
│   ├── outfit-suggestions/       # Outfit category cards
│   └── style-keywords/           # Tag chips
├── constants/
│   └── example-prompts.constant.ts
├── models/
│   └── mood-board.model.ts       # TypeScript interfaces
├── services/
│   ├── mood-board.service.ts     # State management (signals)
│   └── openai.service.ts         # API integration
└── environments/
    ├── environment.ts            # Production config
    └── environment.development.ts # Development config (API key)
```

## Build

```bash
ng build
```

Build artifacts are stored in the `dist/` directory.

## License

MIT
