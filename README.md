# ⚠️ WIP

# Nest Clean - Forum API

A modern REST API for a forum/Q&A system built with NestJS and Clean Architecture principles, featuring complete CRUD operations, authentication, and real-time notifications.

## 🚀 Badges

![Node](https://img.shields.io/badge/node-22.16.0-green)
![NestJS](https://img.shields.io/badge/nestjs-11.0.1-red)
![TypeScript](https://img.shields.io/badge/typescript-5.7.3-blue)
![Prisma](https://img.shields.io/badge/prisma-6.7.0-purple)

## 📑 Table of Contents

- [Technologies](#-technologies)
- [Features](#-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Testing](#-testing)
- [CI/CD](#-cicd)
- [Contributing](#-contributing)
- [License](#-license)
- [Documentation](#documentation)

## 🛠 Technologies

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Redis](https://redis.io/)** - In-memory data store for caching
- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication
- **[Biome](https://biomejs.dev/)** - Fast formatter and linter
- **[Vitest](https://vitest.dev/)** - Blazing fast unit testing
- **[Docker](https://www.docker.com/)** - Containerization
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- ❓ **Questions Management** - Create, read, update, and delete questions
- 💬 **Answers System** - Comprehensive answer management with best answer selection
- 🗨️ **Comments** - Comment on both questions and answers
- 📎 **Attachments** - File attachment support for questions and answers
- 👤 **User Profiles** - Student and instructor role management

### Advanced Features
- 🏆 **Best Answer System** - Mark and track best answers for questions
- 🔔 **Event-Driven Notifications** - Real-time notifications using domain events with smart text truncation
- 🔍 **Search & Filtering** - Fetch recent questions and filter by various criteria
- 📊 **Slug Generation** - SEO-friendly URLs for questions
- ⏰ **Timestamps** - Automatic creation and update tracking
- ✂️ **Smart Text Truncation** - Conditional substring display with ellipsis only when necessary
- 💾 **Redis Caching** - High-performance in-memory caching for frequently accessed data

## 🏗 Architecture

This project implements **Clean Architecture** with **Domain-Driven Design (DDD)** principles:

```
src/
├── core/              # Shared utilities and base classes
│   ├── entities/      # Base entity classes and value objects
│   ├── errors/        # Error handling utilities
│   ├── events/        # Domain event infrastructure
│   └── repositories/  # Repository interfaces
├── domain/           # Business logic layer
│   ├── forum/        # Forum bounded context
│   │   ├── application/  # Use cases and interfaces
│   │   ├── enterprise/   # Domain entities and events
│   │   └── repositories/ # Forum repository implementations
│   └── notification/ # Notification bounded context
│       ├── application/  # Use cases and interfaces
│       ├── enterprise/   # Domain entities and events
│       └── repositories/ # Notification repository implementations
└── infra/           # Infrastructure layer
    ├── auth/        # JWT authentication
    ├── cache/       # Redis cache implementation
    │   ├── cache.module.ts     # Cache module definition
    │   ├── redis.service.ts    # Redis service wrapper
    │   └── cache.repository.ts # Cache repository implementation
    ├── cryptography/ # Password hashing
    ├── database/    # Prisma repositories
    ├── env/         # Environment configuration
    └── http/        # REST API controllers
```

### Key Patterns

- **Use Cases**: All business logic encapsulated in use cases
- **Repository Pattern**: Domain interfaces implemented by infrastructure
- **Domain Events**: Decoupled communication between bounded contexts
- **Value Objects**: Immutable objects like `Slug` and `UniqueEntityId`
- **Either Pattern**: Functional error handling in use cases

## 🚀 Installation

### Prerequisites

- Node.js 22.16.0 or higher
- pnpm 10 or higher
- Docker and Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/05-nest-clean.git
cd 05-nest-clean
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Required environment variables:
```env
NODE_ENV=dev
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=nest_clean
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/nest_clean
JWT_PRIVATE_KEY=your_base64_private_key
JWT_PUBLIC_KEY=your_base64_public_key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### 4. Database setup

Start PostgreSQL using Docker:
```bash
pnpm run prestart:dev
```

Run database migrations:
```bash
pnpm run db:deploy
```

## 🎯 Usage

### Development Mode

Start the development server:
```bash
pnpm run start:dev
```

The API will be available at `http://localhost:3333`

### Production Mode

Build and start the application:
```bash
pnpm run build
pnpm run start:prod
```

### Docker

Run the entire application with Docker Compose:
```bash
pnpm run start:containers
```

### API Endpoints

#### Authentication
- `POST /accounts` - Create account
- `POST /sessions` - Authenticate user

#### Questions
- `GET /questions` - Fetch recent questions
- `POST /questions` - Create question
- `GET /questions/:slug` - Get question by slug
- `PUT /questions/:id` - Edit question
- `DELETE /questions/:id` - Delete question

#### Answers
- `POST /questions/:questionId/answers` - Answer question
- `GET /questions/:questionId/answers` - Fetch question answers
- `PUT /answers/:id` - Edit answer
- `DELETE /answers/:id` - Delete answer
- `PATCH /answers/:id/choose-as-best` - Choose best answer

#### Comments
- `POST /questions/:questionId/comments` - Comment on question
- `POST /answers/:answerId/comments` - Comment on answer
- `DELETE /questions/comments/:id` - Delete question comment
- `DELETE /answers/comments/:id` - Delete answer comment

## 🧪 Testing

### Unit Tests

Run unit tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm run test:watch
```

Generate coverage report:
```bash
pnpm run test:cov
```

### E2E Tests

The project includes comprehensive end-to-end tests with a real PostgreSQL database:

```bash
pnpm run test:e2e
```

Run E2E tests in watch mode:
```bash
pnpm run test:e2e:watch
```

### Test Strategy

- **Unit Tests**: Test individual use cases and domain entities with in-memory repositories
- **E2E Tests**: Test complete HTTP flows with real database integration
- **Test Factories**: Reusable entity factories for consistent test data
- **Mock Repositories**: In-memory implementations for fast unit testing

## 🔄 CI/CD

The project uses GitHub Actions with a comprehensive CI/CD pipeline:

### Pipeline Stages

1. **Code Quality** (`quality`)
   - Biome formatting check
   - Biome linting
   - TypeScript type checking

2. **Unit Tests** (`test-unit`)
   - Run all unit tests
   - Generate Prisma client

3. **E2E Tests** (`test-e2e`)
   - Start PostgreSQL service
   - Start Redis service for caching
   - Run database migrations
   - Execute end-to-end tests

4. **Build** (`build`)
   - Build application for production
   - Generate Docker image tag
   - (AWS deployment steps available but disabled)

### Performance Optimizations

- Parallel job execution for faster builds
- Efficient pnpm caching
- Minimal required permissions per job
- Proper timeout limits

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes following the established patterns
5. **Run** tests: `pnpm test && pnpm run test:e2e`
6. **Run** quality checks: `pnpm run check && pnpm run lint`
7. **Commit** your changes with descriptive messages
8. **Push** to your branch: `git push origin feature/amazing-feature`
9. **Open** a Pull Request

### Code Standards

- Follow Clean Architecture principles
- Write comprehensive tests for new features
- Use TypeScript strictly
- Follow existing naming conventions
- Add proper error handling
- Document complex business logic

### Commit Convention

Please use conventional commits for better changelog generation:

```
feat: add new feature
fix: bug fix
docs: documentation updates
test: test improvements
refactor: code refactoring
chore: maintenance tasks
```

## 📚 Documentation

Detailed documentation for specific features and systems:

- **[Smart Text Truncation](./docs/SMART_TEXT_TRUNCATION.md)** - Learn about the intelligent text truncation system used in notifications and content display

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ using NestJS and Clean Architecture</sub>
</div>