# Moodify

AI-Powered Fashion Mood Board Generator - A demo application showcasing AI capabilities in the fashion/textile industry.

## Features

- **AI-Generated Mood Boards**: Enter a style description and receive a complete fashion mood board
- **Color Palette**: 5-6 curated colors with hex codes and usage suggestions
- **Fabric Recommendations**: 3-4 fabric suggestions with textures and seasonal notes
- **Style Keywords**: Aesthetic descriptors and mood tags
- **Outfit Suggestions**: Complete outfit breakdown (top, bottom, shoes, accessories, outerwear)
- **Multi-language Support**: English and Portuguese (Brazilian) with auto-detection
- **Bold Editorial Design**: Vogue/Harper's Bazaar inspired aesthetic

## Tech Stack

- **Framework**: Angular 21 (standalone components, signals)
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI GPT-4o API
- **i18n**: @jsverse/transloco (English, Portuguese)
- **Fonts**: Playfair Display (serif) + Inter (sans-serif)

## Prerequisites

- Node.js 18+
- npm 9+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Open `src/environments/environment.ts` and replace the placeholder with your API key:

```typescript
export const environment = {
  production: false,
  openaiApiKey: 'sk-your-actual-api-key-here',  // <-- Add your key
  openaiModel: 'gpt-4o',
  openaiApiUrl: 'https://api.openai.com/v1/chat/completions',
};
```

> **Security Note**: This is a demo application. The API key is exposed in the frontend code. For production use, implement a backend proxy to secure your API key.

### 3. Start Development Server

```bash
ng serve
```

Open http://localhost:4200 in your browser.

## Usage

1. Enter a style description in the text area (e.g., "Parisian chic for a gallery opening")
2. Or click one of the example prompt chips to auto-fill
3. Click "Generate Mood Board"
4. View your AI-generated fashion mood board

## Example Prompts

- "Parisian chic for a gallery opening"
- "Coastal grandmother aesthetic for summer"
- "90s minimalism meets modern streetwear"
- "Dark academia for autumn"
- "Maximalist disco glam for New Year's Eve"

## Project Structure

```
src/app/
├── components/
│   ├── header.component.ts           # App branding
│   ├── language-switcher.component.ts # i18n language selector
│   ├── mood-input.component.ts       # Input + example chips
│   ├── mood-board.component.ts       # Results container
│   ├── color-palette.component.ts    # Color swatches
│   ├── fabric-list.component.ts      # Fabric cards
│   ├── style-tags.component.ts       # Style keyword tags
│   ├── outfit-grid.component.ts      # Outfit suggestions
│   └── loading-skeleton.component.ts
├── services/
│   └── openai.service.ts             # OpenAI API integration
├── models/
│   └── mood-board.model.ts           # TypeScript interfaces
├── app.ts                            # Main app component
├── app.html                          # Main template
├── app.config.ts                     # App configuration
└── transloco-loader.ts               # i18n translation loader
```

## Build

```bash
ng build
```

Build artifacts are stored in the `dist/` directory.

## Linting

```bash
npm run lint
```

## Testing

```bash
npm test           # Run tests in watch mode
npm run test:ci    # CI mode: single run with coverage
```

Coverage reports are generated in the `coverage/` directory. Open `coverage/index.html` to view the HTML report.

**Minimum Coverage Expectations: 80%**

### Test Structure

Each component and service has a corresponding `.spec.ts` file:

```
src/app/
├── app.spec.ts
├── components/
│   ├── header.component.spec.ts
│   ├── language-switcher.component.spec.ts
│   ├── mood-input.component.spec.ts
│   ├── mood-board.component.spec.ts
│   ├── color-palette.component.spec.ts
│   ├── fabric-list.component.spec.ts
│   ├── style-tags.component.spec.ts
│   ├── outfit-grid.component.spec.ts
│   └── loading-skeleton.component.spec.ts
├── services/
│   └── openai.service.spec.ts
└── transloco-loader.spec.ts
```

## License

Demo project for educational purposes.
