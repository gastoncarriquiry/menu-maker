---
mode: agent
---

# Menu Maker - AI-Powered Meal Planning Application

## Project Overview

Menu Maker is a full-stack meal planning application that leverages AI to provide personalized menu recommendations. The application features offline-first architecture, dark/light theming, and modern web technologies.

## Technology Stack

### Frontend

- **Framework**: Angular 20 with standalone components
- **Styling**: Angular Material + SCSS
- **Testing**: Jest with jest-preset-angular
- **Build Tool**: Angular CLI
- **PWA**: Service Workers for offline functionality

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: TypeORM with reflect-metadata
- **Testing**: Jest with ts-jest
- **AI Integration**: OpenAI SDK with AI/ML API (Mistral-7B-Instruct-v0.2)

### Infrastructure

- **Containerization**: Docker Compose (versionless spec)
- **Development**: ts-node-dev for hot reloading
- **Code Quality**: ESLint (flat config) + Prettier

## Project Structure

```
menu-maker/
├── frontend/                 # Angular application
├── backend/                  # Express.js API
├── docker-compose.yml        # Container orchestration
├── eslint.config.mjs         # ESLint flat configuration
├── .prettierrc              # Prettier configuration
└── package.json             # Root project configuration
```

## Key Features

1. **AI-Powered Recommendations**: AI improved UX on outputs
2. **Offline-First**: PWA capabilities with service workers and caching
3. **User Authentication**: Secure user management and profiles
4. **Responsive Design**: Mobile-first approach with Angular Material
5. **Dark/Light Theming**: System preference detection and manual toggle
6. **Database Integration**: PostgreSQL with TypeORM for data persistence

## Development Approach

- **Modern Standards**: Latest Angular 20, Node.js best practices
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Testing**: Comprehensive Jest test suites for both applications
- **Code Quality**: Automated linting and formatting
- **Container-First**: Docker development environment

## AI Integration Details

- **Provider**: AI/ML API (docs.aimlapi.com)
- **Model**: mistralai/Mistral-7B-Instruct-v0.2
- **Use Cases**: Menu recommendations, dietary preference analysis, ingredient suggestions
- **API Structure**: OpenAI SDK compatible interface
