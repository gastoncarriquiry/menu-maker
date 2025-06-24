---
mode: agent
---

# Development Rules and Guidelines for Menu Maker

## Code Quality Standards

### ESLint Configuration

- **Format**: Use flat config format in `eslint.config.mjs`
- **Extensions**: Apply to `.ts`, `.js`, and `.mjs` files
- **Rules**: Enforce semicolons, prefer const over let
- **Verification**: Run `npx eslint . --ext .ts,.js` before commits

### Prettier Configuration

- **Location**: `.prettierrc` in project root
- **Settings**: Single quotes, trailing commas
- **Verification**: Run `npx prettier --check .` before commits

## Backend Development Rules

### TypeScript & Express Setup

- **Entry Point**: `src/index.ts` for main application
- **Dependencies**: express, cors, dotenv, pg, typeorm, reflect-metadata
- **Dev Dependencies**: typescript, ts-node-dev, jest, ts-jest, @types/jest
- **Hot Reload**: Use ts-node-dev for development

### Testing with Jest

- **Configuration**: Use `jest.config.ts` (auto-discovered)
- **Preset**: `ts-jest` for TypeScript support
- **Environment**: `node` for backend tests
- **Test Files**: Use `.spec.ts` suffix
- **Health Checks**: Always include `/health` endpoint with tests

### Database & ORM

- **Database**: PostgreSQL 15 in Docker container
- **ORM**: TypeORM with decorators and reflect-metadata
- **Migrations**: Use TypeORM CLI for database schema changes
- **Environment**: Database connection via environment variables

### AI Integration

- **SDK**: Use OpenAI SDK with AI/ML API base URL
- **Model**: mistralai/Mistral-7B-Instruct-v0.2
- **API Key**: Store in `AIML_API_KEY` environment variable
- **Base URL**: https://api.aimlapi.com/v1
- **Error Handling**: Implement proper fallbacks for AI service failures

## Frontend Development Rules

### Angular 20 Standards

- **Architecture**: Use standalone components (no modules)
- **Routing**: Enable routing during project creation
- **Styling**: SCSS with Angular Material
- **Tests**: Skip default tests, use Jest instead

### Angular Material Setup

- **Installation**: Use `ng add @angular/material`
- **Theming**: Custom themes in `src/theme/custom-theme.scss`
- **Import**: Use `@use '@angular/material' as mat;` syntax
- **Components**: Leverage mat.all-component-themes for consistency

### Testing with Jest

- **Configuration**: `jest.config.ts` with jest-preset-angular
- **Environment**: `jsdom` for DOM simulation
- **Setup**: Use `setup-jest.ts` for test configuration
- **Commands**: `npm test` and `npm test:watch`

### Theming Implementation

- **Light/Dark**: Support both themes with user toggle
- **System Preference**: Respect `color-scheme: light dark`
- **Class Toggle**: Use `.dark-theme` class on body element
- **Material Integration**: Use mat.define-light-theme and mat.define-dark-theme

## Docker & Infrastructure Rules

### Docker Compose

- **Version**: Omit version field (use versionless spec)
- **Services**: frontend (port 4200:80), backend (port 3000:3000), db (PostgreSQL)
- **Volumes**: Persist database data with named volumes
- **Environment**: Use environment variables for configuration
- **Build**: Always test with `docker compose up --build`

### Development Workflow

- **Hot Reload**: Both frontend and backend should support hot reloading
- **Port Mapping**: Frontend on 4200, Backend on 3000, Database on 5432
- **Health Checks**: Implement health endpoints for all services

## File Structure Rules

### Backend Structure

```
backend/
├── src/
│   ├── index.ts              # Main application entry
│   ├── index.spec.ts         # Health endpoint tests
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic
│   ├── entities/            # TypeORM entities
│   └── utils/               # Utility functions
├── jest.config.ts           # Jest configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                 # Angular application
│   ├── theme/               # Custom Material themes
│   ├── assets/              # Static assets
│   └── environments/        # Environment configurations
├── jest.config.ts           # Jest configuration
├── setup-jest.ts            # Jest setup file
├── angular.json             # Angular CLI configuration
└── package.json             # Dependencies and scripts
```

## Testing Requirements

### Backend Testing

- **Health Endpoints**: Every major endpoint must have health checks
- **Integration Tests**: Use supertest for HTTP endpoint testing
- **Unit Tests**: Test business logic in isolation
- **Database Tests**: Use test database for integration tests

### Frontend Testing

- **Component Tests**: Test Angular components with Jest
- **Service Tests**: Test Angular services and HTTP calls
- **Integration Tests**: Test component interactions
- **Accessibility**: Include basic a11y tests with Angular Material

## Security & Best Practices

### Environment Variables

- **API Keys**: Never commit API keys to repository
- **Database**: Use environment variables for all database configuration
- **CORS**: Configure CORS properly for production
- **Validation**: Validate all user inputs

### Performance

- **Caching**: Implement proper caching strategies
- **Lazy Loading**: Use Angular lazy loading for routes
- **Bundle Size**: Monitor and optimize bundle sizes
- **Database**: Optimize queries and use proper indexing

## Continuous Integration

- **Linting**: Run ESLint on all commits
- **Formatting**: Ensure Prettier formatting
- **Tests**: All tests must pass before merging
- **Build**: Verify Docker builds succeed

## Documentation Requirements

- **API**: Document all backend endpoints
- **Components**: Document Angular component interfaces
- **Setup**: Maintain clear setup instructions
- **Architecture**: Keep architecture decisions documented
