# Menu Maker - AI-Powered Meal Planning Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Menu Maker is a modern, full-stack meal planning application that leverages AI to provide personalized menu recommendations. Built with cutting-edge technologies and designed with an offline-first approach, it offers a seamless experience for meal planning and dietary management.

## 🌟 Features

- **AI-Powered Recommendations**: Personalized meal suggestions using Mistral-7B model
- **Offline-First Architecture**: PWA capabilities with service workers and caching
- **User Authentication**: Secure user management and profiles
- **Responsive Design**: Mobile-first approach with Angular Material
- **Dark/Light Theming**: System preference detection and manual toggle
- **Database Integration**: PostgreSQL with TypeORM for data persistence

## 🚀 Technology Stack

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

## 📋 Prerequisites

- Node.js 18.x or 20.x LTS
- Docker and Docker Compose
- Git

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/gastoncarriquiry/menu-maker.git
cd menu-maker
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
AIML_API_KEY=your_aiml_api_key_here
POSTGRES_DB=menu_maker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### 4. Start the development environment

```bash
docker compose up --build
```

The application will be available at:

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- Database: localhost:5432

## 🧪 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run tests in watch mode
npm run test:watch
```

### Database Management

```bash
# Run migrations
cd backend && npm run migration:run

# Generate new migration
cd backend && npm run migration:generate -- -n MigrationName

# Revert migration
cd backend && npm run migration:revert
```

## 📁 Project Structure

```
menu-maker/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/             # Angular components and services
│   │   ├── theme/           # Custom Material themes
│   │   └── assets/          # Static assets
│   ├── jest.config.ts       # Jest configuration
│   └── package.json         # Frontend dependencies
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic
│   │   ├── entities/        # TypeORM entities
│   │   └── utils/           # Utility functions
│   ├── jest.config.ts       # Jest configuration
│   └── package.json         # Backend dependencies
├── docker-compose.yml        # Container orchestration
├── eslint.config.mjs         # ESLint flat configuration
├── .prettierrc              # Prettier configuration
└── package.json             # Root project configuration
```

## 🤖 AI Integration

Menu Maker uses the AI/ML API with the Mistral-7B-Instruct-v0.2 model for generating personalized meal recommendations. The AI considers:

- Dietary preferences and restrictions
- Nutritional goals
- Available ingredients
- Cooking time constraints
- Previous meal history

## 🔧 Configuration

### ESLint

The project uses ESLint flat configuration with TypeScript support. Configuration is in `eslint.config.mjs`.

### Prettier

Code formatting is handled by Prettier with single quotes and trailing commas. Configuration is in `.prettierrc`.

### Docker

Services are orchestrated using Docker Compose without version specification (versionless spec). Database data is persisted using named volumes.

## 🧭 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Menus

- `GET /api/menus` - Get user menus
- `POST /api/menus` - Create new meal
- `PUT /api/menus/:id` - Update meal
- `DELETE /api/menus/:id` - Delete meal

### Recommendations

- `POST /api/recommend` - Get AI meal recommendations
- `GET /api/recommend/history` - Get recommendation history

### Health

- `GET /health` - Health check endpoint

## 🎨 Theming

The application supports both light and dark themes using Angular Material's theming system. Themes automatically respect system preferences and can be manually toggled.

## 📱 PWA Features

- Offline functionality
- Install prompt
- Background sync
- Push notifications (future feature)
- App-like experience on mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Angular](https://angular.io/) for the awesome framework
- [Angular Material](https://material.angular.io/) for the UI components
- [TypeORM](https://typeorm.io/) for the excellent ORM
- [AI/ML API](https://docs.aimlapi.com/) for AI integration
- [PostgreSQL](https://www.postgresql.org/) for the robust database

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub.

---

**Happy meal planning! 🍽️**
