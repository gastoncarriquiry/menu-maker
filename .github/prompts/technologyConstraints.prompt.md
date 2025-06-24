---
mode: agent
---

# Technology Constraints and Requirements

## Mandatory Technology Stack

### Frontend Requirements

- **Angular Version**: Must use Angular 20
- **Component Architecture**: Standalone components only (no NgModules)
- **Styling Framework**: Angular Material + SCSS
- **Testing Framework**: Jest with jest-preset-angular (NOT Karma/Jasmine)
- **Build Tool**: Angular CLI
- **PWA Support**: Required for offline functionality

### Backend Requirements

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15 (containerized)
- **ORM**: TypeORM with reflect-metadata
- **Testing**: Jest with ts-jest preset
- **Development Server**: ts-node-dev for hot reloading

### Infrastructure Requirements

- **Containerization**: Docker Compose (versionless specification)
- **Database Container**: postgres:15 official image
- **Volume Management**: Named volumes for data persistence

## Code Quality Constraints

### ESLint Configuration

- **Format**: MUST use flat config format (.mjs file)
- **Location**: eslint.config.mjs in repository root
- **Import Style**: Use `import { defineConfig } from "eslint/config"`
- **File Coverage**: Apply to .ts, .js, and .mjs files
- **Required Rules**: semicolons (error), prefer-const (warn)

### Prettier Configuration

- **Location**: .prettierrc in repository root
- **Format**: JSON configuration file
- **Required Settings**: singleQuote: true, trailingComma: "all"

### TypeScript Configuration

- **Strict Mode**: Enable strict TypeScript checking
- **Target**: ES2020 or later
- **Module System**: ESNext with module resolution Node
- **Decorators**: Enable experimental decorators for TypeORM

## Testing Constraints

### Backend Testing

- **Framework**: Jest with ts-jest preset only
- **Configuration**: jest.config.ts (TypeScript configuration)
- **Test Environment**: node
- **File Naming**: .spec.ts suffix for test files
- **Required Tests**: Health endpoint testing with supertest

### Frontend Testing

- **Framework**: Jest with jest-preset-angular only
- **Configuration**: jest.config.ts with jsdom environment
- **Setup File**: setup-jest.ts for Angular testing setup
- **Builder**: @angular-builders/jest for Angular CLI integration
- **Coverage**: Maintain test coverage for components and services

## AI Integration Constraints

### AI Provider

- **Service**: AI/ML API (docs.aimlapi.com)
- **SDK**: OpenAI SDK (OpenAI compatible interface)
- **Base URL**: https://api.aimlapi.com/v1
- **Model**: mistralai/Mistral-7B-Instruct-v0.2 (fixed)

### API Configuration

- **Environment Variable**: AIML_API_KEY for authentication
- **Temperature**: 0.7 for balanced creativity
- **Max Tokens**: 256 for concise responses
- **Message Format**: System + User role structure

## Docker Constraints

### Compose Specification

- **Version Field**: MUST be omitted (versionless spec)
- **Service Names**: frontend, backend, db (exact names)
- **Port Mapping**: frontend (4200:80), backend (3000:3000)
- **Database**: postgres:15 image only

### Volume Requirements

- **Database Persistence**: Named volume (db-data)
- **Mount Point**: /var/lib/postgresql/data
- **Environment Variables**: POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD

## Angular Material Constraints

### Theming Requirements

- **Import Syntax**: @use '@angular/material' as mat;
- **Theme Functions**: mat.define-light-theme, mat.define-dark-theme
- **Component Themes**: mat.all-component-themes mixin
- **File Location**: src/theme/custom-theme.scss

### Color Palette

- **Primary**: mat.$indigo-palette
- **Accent**: mat.$pink-palette (A200, A100, A400)
- **Warn**: mat.$red-palette

### Dark Theme Implementation

- **CSS Class**: .dark-theme for dark mode toggle
- **System Preference**: color-scheme: light dark in HTML
- **Theme Service**: Angular service for theme state management

## File Structure Constraints

### Repository Root

```
menu-maker/
├── eslint.config.mjs        # Flat ESLint config
├── .prettierrc              # Prettier configuration
├── docker-compose.yml       # Versionless Docker Compose
├── package.json             # Root project metadata
├── frontend/                # Angular application
└── backend/                 # Express.js API
```

### Backend Structure

```
backend/
├── src/
│   ├── index.ts            # Main application entry
│   └── index.spec.ts       # Health endpoint tests
├── jest.config.ts          # Jest configuration
├── tsconfig.json           # TypeScript config
└── package.json            # Backend dependencies
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/               # Angular application
│   └── theme/             # Material theme files
├── jest.config.ts         # Jest configuration
├── setup-jest.ts          # Jest setup
└── package.json           # Frontend dependencies
```

## Prohibited Technologies

### Frontend Prohibitions

- **Testing**: NO Karma, NO Jasmine, NO Protractor
- **Modules**: NO NgModules (standalone components only)
- **State Management**: NO NgRx initially (service-based state)
- **CSS Frameworks**: NO Bootstrap, NO Tailwind (Angular Material only)

### Backend Prohibitions

- **Frameworks**: NO Nest.js, NO Fastify (Express.js only)
- **ORMs**: NO Prisma, NO Sequelize (TypeORM only)
- **Testing**: NO Mocha, NO Vitest (Jest only)
- **Databases**: NO MongoDB, NO MySQL (PostgreSQL only)

### General Prohibitions

- **Package Managers**: NO Yarn, NO pnpm (npm only)
- **Build Tools**: NO Webpack customization, NO Vite (Angular CLI)
- **Linting**: NO TSLint, NO Standard (ESLint flat config only)

## Version Constraints

### Exact Version Requirements

- **Angular**: 20.x.x
- **PostgreSQL**: 15.x
- **Node.js**: 18.x or 20.x LTS
- **TypeScript**: 5.x.x

### Minimum Version Requirements

- **Jest**: 29.x or later
- **ESLint**: 9.x or later (flat config support)
- **Docker Compose**: 2.x (versionless spec support)

## Performance Constraints

### Bundle Size

- **Frontend**: Initial bundle < 500KB gzipped
- **Lazy Loading**: Implement for feature modules
- **Tree Shaking**: Ensure proper tree shaking for unused code

### Database

- **Connection Pooling**: Configure proper connection limits
- **Query Optimization**: Use proper indexing strategies
- **Migration Management**: Version-controlled database migrations

### AI API

- **Response Caching**: Implement caching for repeated queries
- **Error Handling**: Graceful degradation when AI service unavailable
- **Rate Limiting**: Respect AI API rate limits and implement backoff
