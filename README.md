# Moodify

AI-Powered Fashion Mood Board Generator - A demo application showcasing AI capabilities in the fashion/textile industry.

## Features

- **AI-Generated Mood Boards**: Enter a style description and receive a complete fashion mood board
- **Color Palette**: 5-6 curated colors with hex codes and usage suggestions
- **Fabric Recommendations**: 3-4 fabric suggestions with textures and seasonal notes
- **Style Keywords**: Aesthetic descriptors and mood tags
- **Outfit Suggestions**: Complete outfit breakdown (top, bottom, shoes, accessories, outerwear)
- **AI Outfit Visualization**: DALL-E generated outfit images based on suggestions
- **JWT Authentication**: Secure login with protected API routes
- **Multi-language Support**: English and Portuguese (Brazilian) with auto-detection
- **Dark/Light Theme**: Toggle between dark and light modes
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

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Servers

Set the required environment variables and start both servers:

**Linux/macOS:**
```bash
OPENAI_API_KEY=sk-your-key JWT_SECRET=dev-secret npm run dev
```

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-your-key"; $env:JWT_SECRET="dev-secret"; npm run dev
```

**Windows (CMD):**
```cmd
set OPENAI_API_KEY=sk-your-key && set JWT_SECRET=dev-secret && npm run dev
```

This starts:
- Angular dev server at http://localhost:4200
- Express backend at http://localhost:3000

The Angular dev server proxies all `/api/*` requests to the Express backend, which handles authentication and OpenAI API calls.

### Demo Credentials

- **Email**: `bob@audaces.com`
- **Password**: `12345`

## Docker Deployment

For production, use Docker to run the application with a secure backend proxy.

### Build the Docker Image

```bash
docker build -t moodify .
```

### Run the Container

```bash
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-your-key -e JWT_SECRET=your-secret moodify
```

Open http://localhost:3000 in your browser.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | Your OpenAI API key |
| `JWT_SECRET` | Yes | - | Secret key for JWT token signing |
| `PORT` | No | 3000 | Port the server listens on |

### Docker Compose (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  moodify:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
```

Then run:

```bash
OPENAI_API_KEY=sk-your-key JWT_SECRET=your-secret docker-compose up
```

## Usage

1. Log in with demo credentials (`bob@audaces.com` / `12345`)
2. Enter a style description in the text area (e.g., "Parisian chic for a gallery opening")
3. Or click one of the example prompt chips to auto-fill
4. Click "Generate Mood Board"
5. View your AI-generated fashion mood board with outfit visualization

## Example Prompts

- "Parisian chic for a gallery opening"
- "Coastal grandmother aesthetic for summer"
- "90s minimalism meets modern streetwear"
- "Dark academia for autumn"
- "Maximalist disco glam for New Year's Eve"

## Project Structure

```
src/app/
├── auth/
│   ├── auth.service.ts               # Token management, login/logout
│   ├── auth.interceptor.ts           # JWT header injection, 401 handling
│   ├── auth.guard.ts                 # Route protection
│   └── login.component.ts            # Login page
├── components/
│   ├── header.component.ts           # App branding + logout button
│   ├── language-switcher.component.ts # i18n language selector
│   ├── theme-switcher.component.ts   # Dark/light mode toggle
│   ├── mood-input.component.ts       # Input + example chips
│   ├── mood-board.component.ts       # Results container
│   ├── color-palette.component.ts    # Color swatches
│   ├── fabric-list.component.ts      # Fabric cards
│   ├── style-tags.component.ts       # Style keyword tags
│   ├── outfit-grid.component.ts      # Outfit suggestions
│   ├── outfit-image.component.ts     # AI-generated outfit image
│   └── loading-skeleton.component.ts
├── services/
│   └── openai.service.ts             # OpenAI API integration
├── models/
│   └── mood-board.model.ts           # TypeScript interfaces
├── app.ts                            # Root component (router-outlet)
├── app.routes.ts                     # Route definitions
├── app.config.ts                     # App configuration
├── home.component.ts                 # Main mood board page
├── home.component.html               # Main template
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
├── home.component.spec.ts
├── auth/
│   ├── auth.service.spec.ts
│   ├── auth.interceptor.spec.ts
│   ├── auth.guard.spec.ts
│   └── login.component.spec.ts
├── components/
│   ├── header.component.spec.ts
│   ├── language-switcher.component.spec.ts
│   ├── theme-switcher.component.spec.ts
│   ├── mood-input.component.spec.ts
│   ├── mood-board.component.spec.ts
│   ├── color-palette.component.spec.ts
│   ├── fabric-list.component.spec.ts
│   ├── style-tags.component.spec.ts
│   ├── outfit-grid.component.spec.ts
│   ├── outfit-image.component.spec.ts
│   └── loading-skeleton.component.spec.ts
├── services/
│   └── openai.service.spec.ts
└── transloco-loader.spec.ts
```

## License

Demo project for educational purposes.
