# Movie Platform

A full-stack application for managing movies, actors, and ratings. Built with NestJS for the backend and Next.js for the frontend.

## Features

- **Movies management**: View, search, and manage movie information
- **Actors management**: Browse actors and their filmography
- **Ratings**: View and manage movie ratings
- **Search**: Search for movies and actors by name
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Docker
- Node.js

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd movie-api
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database credentials and other settings.

3. Start the database (using Docker):

   ```bash
   docker-compose up -d
   ```

4. Run database migrations:

   ```bash
   npm run typeorm migration:run
   # or
   yarn typeorm migration:run
   ```

5. Run database seeds:

   ```bash
   npm run seed
   # or
   yarn seed
   ```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd web
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your API URL and other settings.

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

The frontend will be available at `http://localhost:3001`

### Backend Tests

```bash
cd movie-api
npm test
# or
yarn test
```

## 🔧 API Documentation

Once the backend is running, you can access the API documentation at `http://localhost:3000/api/docs` (Swagger UI).

## 📱 Features

- **Movies**
  - List all movies
  - Search movies by name
  - View movie details, including cast and ratings
  - Add/Edit/Delete movies (with authentication)

- **Actors**
  - List all actors
  - Search actors by name
  - View actor details and filmography
  - Add/Edit/Delete actors (with authentication)

- **Ratings**
  - View ratings for movies
  - Add new ratings (with authentication)

## ⚠️ Known Limitations

### Backend

- **Error handling**: Some edge cases might not be fully handled.
- **Validation**: Input validation could be more comprehensive.
- **Pagination**: A few resources (ratings) don't implement pagination.

### Frontend

- **Actors**: Actor filmography is not integrated with the back-end.
- **Search**: Search implementation was not finished.
- **Pagination**: Pagination implementation was not finished.
- **Error states**: Some error states might not be fully handled in the UI.
