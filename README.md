# Discussion Forum

This project is a simple discussion forum created as a learning exercise.
The main goal of the project is to practice backend development, project structure,
environment variable handling, and testing.

The project is incomplete and intended for educational purposes.

## Overview

The application consists of a backend and a frontend.
The backend is implemented using Deno and the frontend is located in the client directory.

The database and migrations are planned, but not fully enabled yet.
Some API routes still return mocked or hardcoded data.

## Quick start

### Prerequisites

- Docker + Docker Compose
- Deno
- Node/npm

### To run locally

1. Start dependencies:
```
cmd
docker compose up --build
```

2. Open browser:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## Project structure
```
- client/                   Frontend
- server/                   Backend (Deno + Hono)
- database-migrations/      Database migrations (not actively used)
- e2e-tests/                Playwright E2E tests (not implemented yet)
- compose.yaml              Docker Compose configuration
- deno.json                 Deno tasks and configuration
- deploy.sh                 Deploy script
- project.env.example       Example environment variables file
- README.md
```
## Technologies used

- Deno
- Hono
- Docker
- PostgreSQL (not implemented)
- Flyway (not implemented)
- Playwright (E2E tests, not implemented)

## The following routes are implemented:

- GET /courses
- GET /courses/:id
- POST /courses
- GET /courses/:id/topics
- GET /courses/:cId/topics/:tId/posts
- GET /courses/:cId/topics/:tId/posts/:pId

- Not all routes currently use a database.

## Environment variables

The project uses environment variables for database connections and configuration.

The repository includes a `project.env.example` file that contains all required
environment variable keys without real values.

Example:

```env
# Values are intentionally empty.
# Real values are provided in production environment variables.

# Database (PostgreSQL)
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# Flyway
FLYWAY_USER=
FLYWAY_PASSWORD=
FLYWAY_URL=

# Postgres client
PGUSER=
PGPASSWORD=
PGDATABASE=
PGHOST=
PGPORT=
```

The actual project.env file containing real values is intended for local or production use
and should never be committed to the repository.

## Deployment

A deploy.sh script is included to simplify deployment.

- ./deploy.sh

The script automates committing changes and deploying the project.

# Notes
This project is a learning exercise and demo. 
It's not intended for production use. Some features are incomplete by design.
