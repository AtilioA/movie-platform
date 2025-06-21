# Frontend Technical Specification: Movie Platform

## 1. Overview

This document outlines the technical architecture, libraries, and implementation patterns for the Movie Platform frontend. The application will be a responsive, modern web app built with Next.js, providing a user interface to browse, search, and view details about movies and actors by consuming a backend REST API.

## 2. Core technologies & Libraries

 | Category | Technology / Library | Version / Note |
 | :--- | :--- | :--- |
 | **Framework** | Next.js | v14+ (App Router) |
 | **Language** | TypeScript | v5+ |
 | **UI Components** | ShadCN/UI | As a base for custom components |
 | **Styling** | TailwindCSS | Utility-first CSS framework |
 | **Data Fetching** | React Query (TanStack) | For client-side data fetching, caching, and state |
 | **Global State** | Zustand | For minimal global state (e.g., search query) |
 <!-- | **Animations** | Framer Motion | For subtle UI animations and transitions | -->
 | **Testing** | Jest | For unit testing hooks and utilities |
 | **API Client** | Axios as `fetch` wrapper | Typed client for interacting with the backend |

## 3. Project Structure

 The project will follow a feature-oriented structure within the Next.js App Router paradigm.

 ```
/src
├── /app
│   ├── /movies
│   │   ├── /[id]
│   │   │   ├── page.tsx          # Movie Details (Server Component)
│   │   │   └── loading.tsx       # Skeleton loader for movie details
│   │   └── page.tsx              # Movie List & Search (Client Component)
│   ├── /actors
│   │   ├── /[id]
│   │   │   ├── page.tsx          # Actor Details (Server Component)
│   │   │   └── loading.tsx       # Skeleton loader for actor details
│   │   └── page.tsx              # Actor List & Search (Client Component)
│   ├── /login
│   │   └── page.tsx              # Client-side login form
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── /components
│   ├── /ui                       # Generic components from ShadCN (Button, Card, Input)
│   └── /features                 # Domain-specific components (MovieCard, SearchBar)
├── /hooks
│   └── use-debounce.ts           # Custom hook for debouncing search input
├── /lib
│   ├── api.ts                    # Typed API client for backend communication
│   ├── utils.ts                  # Utility functions (e.g., clsx, tailwind-merge)
│   └── store.ts                  # Zustand store definition
├── /types
│   └── index.ts                  # Shared TypeScript types with backend (Movie, Actor, Rating)
└── /public
│   └──...                       # Static assets
```

## 4. Architecture & Key patterns

### 4.1. Routing & Rendering strategy

- **Next.js App Router:** All routes will be defined within the `/app` directory.
- **Server Components (SSR):**
  - Detail pages (`/movies/[id]`, `/actors/[id]`) will be implemented as **Server Components**.
  - They will fetch data directly on the server using the API client, providing excellent SEO and fast initial load times.
  - A `loading.tsx` file will be used alongside these pages to show an instant **Skeleton UI** while data is being fetched on the server.
- **Client Components:**
  - Pages requiring interactivity, such as listing pages with search and pagination (`/movies`, `/actors`), will be marked with `'use client'`.

### 4.2. Data fetching & state management

- **React Query:** Will be the primary tool for client-side data management.
  - `useQuery` will be used for fetching lists of movies/actors. It will handle caching, loading states, and error states automatically.
  - Pagination will have a page-based structure, not infinite scroll.
- **Typed API Client (`/lib/api.ts`):**
  - A centralized, typed wrapper around `fetch` (using axios) will be created.
  - It will be responsible for setting the base URL, attaching the JWT from cookies to authorized requests, and parsing JSON responses.
- **Global state (Zustand):**
  - A lightweight Zustand store will be created to manage the global search query. This decouples the `SearchBar` component from the results display, allowing the query to be accessed from anywhere in the app if needed.
  
### 4.3. Component & Styling strategy

- **ShadCN/UI:** Used as a foundation. We will install individual components (e.g., `Button`, `Card`, `Input`, `Skeleton`) and customize them as needed.
- **Mobile-first & Responsive design:**
  - All components will be styled mobile-first using TailwindCSS's utility classes.
  - `Flexbox` and `Grid` will be used to create responsive layouts that adapt from single-column on mobile to multi-column grids on desktop (e.g., for movie card listings).

### 4.4. User Experience (UX) enhancements

- **Search debouncing:** The search input will use a custom `useDebounce` hook to prevent firing API requests on every keystroke, reducing backend load and improving performance. The delay will be set to 300ms.
- **Loading states:** Skeleton loaders (`loading.tsx` for routes, `Skeleton` component for client-side) will be used extensively to provide a better perceived performance than traditional spinners.
- **Animations:** `framer-motion` will be used for subtle, non-intrusive animations, such as `whileHover` effects on cards and layout animations when search results appear or disappear.

### 4.5. Authentication

- **Registration:** A simple form on the `/register` page will collect credentials and trigger the registration flow. No reset password.
- **Login UI:** A simple form on the `/login` page will collect credentials and trigger the authentication flow. No reset password.
- **JWT Storage:** Upon successful login, the JWT received from the backend will be stored in a secure, `httpOnly` cookie.
- **API Client Integration:** The typed API client will automatically read the JWT from cookies and include it in the `Authorization: Bearer <token>` header for all protected requests.

## 5. Testing Strategy

- **Unit Tests (Jest):**
  - Testing will be focused on pure logic and custom hooks.
  - **In scope:**
    - The `useDebounce` hook.
    - Any utility functions in `/lib/utils.ts`.
  - **Out of scope:**
    - Component rendering tests (integration tests).
    - End-to-end (E2E) tests.

## 6. Environment & configuration

- All environment-specific variables will be managed in a `.env` file.
- A `.env.example` file will be committed to the repository to document required variables.
- **Required variables:**
  - `NEXT_PUBLIC_API_URL`: The base URL for the backend API (e.g., `http://localhost:3000/api/v1`).
