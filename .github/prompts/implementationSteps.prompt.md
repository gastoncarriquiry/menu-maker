---
mode: agent
---

# Implementation Steps for Menu Maker

## Step 1: Repository Initialization & Tooling

### Package.json Setup

- Initialize root package.json with `npm init -y`
- Set name to "menu-maker"
- Configure scripts for linting and formatting

### Development Dependencies

```bash
npm install --save-dev eslint prettier
```

### ESLint Flat Configuration

Create `eslint.config.mjs` in repo root:

```javascript
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.ts', '**/*.js', '**/*.mjs'],
    rules: {
      semi: ['error', 'always'],
      'prefer-const': 'warn',
    },
  },
]);
```

### Prettier Configuration

Create `.prettierrc`:

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

### Verification Commands

```bash
npx eslint . --ext .ts,.js
npx prettier --check .
```

## Step 2: Docker Compose Baseline

### Create docker-compose.yml (Versionless)

```yaml
services:
  frontend:
    build: ./frontend
    ports: ['4200:80']
  backend:
    build: ./backend
    ports: ['3000:3000']
    environment:
      DB_HOST: db
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: menu_maker
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:
```

### Verification

```bash
docker compose up --build
```

## Step 3: Backend Baseline with TypeScript & Jest

### Backend Directory Setup

```bash
mkdir backend && cd backend
npm init -y
```

### Backend Dependencies

```bash
npm install express cors dotenv pg typeorm reflect-metadata
npm install --save-dev typescript ts-node-dev jest ts-jest @types/jest
```

### Configuration Files

```bash
npx tsc --init
npx ts-jest config:init
```

### Jest Configuration (jest.config.ts)

```typescript
/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
export default config;
```

### Basic Express App

- Create `src/index.ts` with Express server
- Add `/health` endpoint
- Create `src/index.spec.ts` with supertest tests

### Verification Commands

```bash
npm run build
npm test
```

## Step 4: Frontend Baseline with Angular & Jest

### Angular Application Generation

```bash
cd ../frontend
npx @angular/cli new meal-planner-frontend --standalone --routing --style=scss --skip-tests
```

### Angular Dependencies

```bash
ng add @angular/material
npm install --save-dev jest-preset-angular @angular-builders/jest
```

### Jest Configuration for Angular (jest.config.ts)

```typescript
import type { Config } from 'jest';
const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
};
export default config;
```

### Package.json Scripts Update

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

## Step 5: Database & ORM Setup

### TypeORM Configuration

- Configure TypeORM in backend
- Create database entities
- Set up migrations
- Connect to PostgreSQL container

### Database Schema

- Users table for authentication
- Menus table for meal information
- Preferences table for user preferences
- Menu_items table for generated menus

## Step 6: Authentication & Users

### Backend Authentication

- Implement JWT-based authentication
- Create user registration/login endpoints
- Add password hashing with bcrypt
- Set up middleware for protected routes

### Frontend Authentication

- Create Angular authentication service
- Implement login/register components
- Add route guards for protected pages
- Handle token storage and refresh

## Step 7: AI-Powered Recommendations

### AI/ML API Integration

```javascript
const { OpenAI } = require('openai');
const api = new OpenAI({
  apiKey: process.env.AIML_API_KEY,
  baseURL: 'https://api.aimlapi.com/v1',
});

const completion = await api.chat.completions.create({
  model: 'mistralai/Mistral-7B-Instruct-v0.2',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ],
  temperature: 0.7,
  max_tokens: 256,
});
```

### Backend Recommendation Endpoint

```typescript
app.post('/recommend', async (req, res) => {
  const result = await recommendMenus(req.body);
  res.json(result);
});
```

### Frontend Integration

- Create recommendation service
- Build user preference forms
- Display AI-generated menus
- Handle loading states and errors

## Step 8: Offline-First & Caching

### Service Worker Implementation

- Configure Angular PWA
- Implement caching strategies
- Add offline indicators
- Store data locally for offline access

### Backend Caching

- Implement Redis for session storage
- Cache AI responses for repeated queries
- Add cache invalidation strategies

## Step 9: Theming - Dark/Light Mode

### Custom Angular Material Theme

Create `src/theme/custom-theme.scss`:

```scss
@use '@angular/material' as mat;
@include mat.core();

$primary: mat.define-palette(mat.$indigo-palette);
$accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$warn: mat.define-palette(mat.$red-palette);

$light-theme: mat.define-light-theme(
  (
    color: (
      primary: $primary,
      accent: $accent,
      warn: $warn,
    ),
  )
);
@include mat.all-component-themes($light-theme);
```

### Dark Theme Support

```scss
$dark-theme: mat.define-dark-theme(
  (
    color: (
      primary: $primary,
      accent: $accent,
      warn: $warn,
    ),
  )
);
.dark-theme {
  @include mat.all-component-themes($dark-theme);
}
```

### Global Styles Import

In `styles.scss`:

```scss
@import 'theme/custom-theme.scss';
html {
  color-scheme: light dark;
}
```

### Theme Toggle Implementation

- Create theme service for toggle logic
- Add theme switch component
- Persist theme preference
- Respect system preferences

## Final Verification Steps

### Development Environment

1. All Docker services start without errors
2. Frontend builds and serves correctly
3. Backend API responds to health checks
4. Database connections work
5. AI API integration functions

### Code Quality

1. ESLint passes with no errors
2. Prettier formatting is consistent
3. All tests pass (frontend and backend)
4. TypeScript compilation succeeds

### Features

1. User authentication works
2. AI recommendations generate properly
3. Offline functionality operates
4. Theme switching functions
5. Database operations complete successfully
