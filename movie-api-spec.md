# Movie API specification

This document consolidates the functional requirements, non-functional requirements, business rules, and key implementation details for the NestJS + TypeScript + TypeORM backend.

---

## 1. Functional Requirements

### 1.1. Movies

- **Base path**: `/api/v1/movies`
- **Endpoints**
  - `GET    /api/v1/movies`
    • List movies
    • Query params:
    - `search` (partial, case-insensitive title)
    - `limit`, `offset` (default `limit=10`, max `100`)
    - `sort` (e.g. `title`)
  - `GET    /api/v1/movies/:id`
    • Retrieve a movie by ID
  - `POST   /api/v1/movies`
    • Create a new movie
    • Protected (JWT)
  - `PATCH  /api/v1/movies/:id`
    • Partial update
    • Protected
  - `DELETE /api/v1/movies/:id`
    • Delete a movie
    • Protected
  - `GET    /api/v1/movies/:id/actors`
    • List all actors in a given movie

### 1.2. Actors

- **Base path**: `/api/v1/actors`
- **Endpoints**
  - `GET    /api/v1/actors`
    • List actors
    • Query params: `search`, `limit`, `offset`, `sort`
  - `GET    /api/v1/actors/:id`
    • Retrieve one actor
  - `POST   /api/v1/actors`
    • Create actor (protected)
  - `PATCH  /api/v1/actors/:id`
    • Update actor (protected)
  - `DELETE /api/v1/actors/:id`
    • Delete actor (protected)
  - `GET    /api/v1/actors/:id/movies`
    • List all movies an actor has been in

### 1.3. Ratings

- **Base path**: `/api/v1/ratings`
- **Endpoints**
  - `GET    /api/v1/ratings`
    • List ratings
    • Query params: `movieId`, `limit`, `offset`
  - `GET    /api/v1/ratings/:id`
    • Retrieve one rating
  - `POST   /api/v1/ratings`
    • Create rating (protected)
  - `PATCH  /api/v1/ratings/:id`
    • Update rating (protected)
  - `DELETE /api/v1/ratings/:id`
    • Delete rating (protected)

### 1.4 Auth

- **Base path**: `/api/v1/auth`
- **Endpoints**
  - `POST /api/v1/auth/register`
    • Create a user (with hashed password)
  - `POST /api/v1/auth/login`
    • Validate credentials, return access_token (and perhaps a refresh_token)
Add configurable token expiration to .env.example. Default to 7 days.

### 1.5. Search, filtering & pagination

- Partial, case-insensitive substring search on movie titles & actor names
- Pagination via `limit`/`offset` (default `limit=10`, max `100`)
- Invalid query params → `400 Bad Request`
- Wrap lists in a standard envelope:

```json
{
  "data": [ /* items */ ],
  "meta": {
    "total": 345,
    "limit": 10,
    "offset": 20
  }
}
```

### 1.6. Relationships (Domain Model)

- Movie ↔ Actor: **many-to-many** (join table)
- Movie → Rating: **one-to-many**
- Actor → Movie: **many-to-many**
- Expose directional endpoints for each association

### 1.7. Security & Authentication

- All **POST**, **PATCH**, **DELETE** endpoints require a valid JWT in `Authorization: Bearer <token>`
- **GET** endpoints are public
- Implement a NestJS Guard; token read from environment variable

### 1.8. Validation & Error Handling

- Use DTOs and `class-validator` to enforce payload schemas
- Return proper HTTP status codes:
  - `200 OK`, `201 Created`, `204 No Content`
  - `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`
- Global exception filter to catch unhandled errors

Define a uniform error object schema for all non‑200s, e.g.:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [ /* field errors, if applicable */ ]
}
```

### 1.9. Data Layer

- **Code-first** TypeORM entities + migrations (no `synchronize: true` in production)
- Seed script (`npm run seed`) to upsert sample movies, actors, ratings. Modularize the seed script with fixture files.

### 1.10. API Documentation

- Swagger/OpenAPI support via `@nestjs/swagger` and available at `/api/v1/docs`. All endpoints should be documented.

### 1.11. DevOps & Testing (Bonus)

- `Dockerfile` and `docker-compose.yml` for NestJS app; Postgres + API + migrations
- Jest unit tests (services)

---

## 2. Non-functional requirements

### 2.1. Performance & Scalability

- Index searchable columns (`movie.title`, `actor.name`) for better string search performance.
- Handling N+1 queries is overkill for now

### 2.2. Maintainability & Code quality

- NestJS module/service/controller separation
- Configuration via `@nestjs/config` and `.env` files
- ESLint + Prettier
- README with setup, run, seed, docs, and example requests (all using Docker)
  - How to set up and run the backend/frontend locally.
  - How to use the API endpoints.
  - Any additional comments you might have regarding your code.
- Ensure the code follows **SOLID principles**.
- Ensure the project **does not crash** and handles errors gracefully.

### 2.3. Security

- Sanitize & validate all inputs, including but not limited to query params
- Store secrets only in environment variables
- Protect CUD endpoints with Guards

### 2.4. Reliability

- Global exception filter/middleware for unhandled errors, whatever is idiomatic in NestJS
- Unexpected failures → `500 Internal Server Error` (log and handle; don't crash)
- Handle all edge cases, such as missing/invalid input, invalid JWT, missing resources, etc.

### 2.5. Observability

- Structured logging with **pino** (include request IDs, log levels)
- Health-check endpoint: `GET /health`

---

## 3. Business Rules

### 3.1. Movie

- `title`: nonempty string
- A movie can have multiple ratings.
- A movie can have multiple actors.
- Deleting a movie **cascades** ratings;
- Deleting a movie **does not** remove/cascade actors.

### 3.2. Actor

- `name`: nonempty string
- A actor can be in multiple movies.
- Deleting an actor **removes** associations; movies remain.

### 3.3. Rating

- `score`: integer between 1 and 5 (inclusive)
- `comment`: optional, max length 500 chars
- Must reference an existing movie

### 3.4. Associations

- An actor may appear in a movie only once (unique constraint on join table)

### 3.5. Pagination & Sorting

- Default page size = 10, max = 100
- Unknown sort field → `400 Bad Request`

### 3.6. Data seeding

- Seed script must be idempotent (use upsert or `ON CONFLICT`)
- Sample data must include ≥50 movies, ≥50 actors, ≥100 ratings

---

## 4. Implementation details

### 4.1. NestJS modules & layers

Use a clean architecture for endpoints, similar to this: endpoints -> services -> repositories, with DTOs in between and validation via class-validator.

- **Modules**: `movies`, `actors`, `ratings`, `auth`, `shared`
- **Controllers** handle routing & HTTP layer
- **Services** contain business logic
- **Repositories/Entities** manage DB access via TypeORM

Example folder structure:
./app.module.ts
./main.ts
src/
├── movies/
│   ├── movies.module.ts
│   ├── movies.controller.ts
│   ├── movies.service.ts
│   ├── dtos/
│   ├── entities/
│   └── repositories/
├── actors/
│   ├── actors.module.ts
│   ├── actors.controller.ts
│   ├── actors.service.ts
│   └── dtos/entities/
├── ratings/
│   ├── ratings.module.ts
│   ├── ratings.controller.ts
│   ├── ratings.service.ts
│   └── dtos/entities/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── dtos/entities/
└── common/
    ├── guards/
    ├── interceptors/
    ├── filters/
    └── utils/

### 4.2. DTOs & Validation

```ts
// src/movies/dto/create-movie.dto.ts
import {
  IsString,
  IsDateString,
  IsOptional,
  IsArray,
  ArrayUnique
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  actorIds?: number[];
}
```

### 4.3. TypeORM entities & Migrations

- Define entities code-first; generate migrations via `typeorm migration:generate`
- Example relationship:

  ```ts
  @Entity()
  export class Movie {
    @PrimaryGeneratedColumn() id: number;

    @Column() title: string;

    @ManyToMany(() => Actor, (actor) => actor.movies)
    @JoinTable()
    actors: Actor[];

    @OneToMany(() => Rating, (rating) => rating.movie, { cascade: ['remove'] })
    ratings: Rating[];
  }
  ```

### 4.4. Guards & Security

- Protect routes with `@UseGuards(JwtGuard)`

### 4.5. Exception handling

- Global filter extending `BaseExceptionFilter` to format errors
- Map known exceptions to proper HTTP codes

### 4.6. Logging

- Use **pino** via `nestjs-pino` integration
- Include request IDs and log levels (`info`, `warn`, `error`)

### 4.7. Health check

- Simple controller:

```ts
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

---
