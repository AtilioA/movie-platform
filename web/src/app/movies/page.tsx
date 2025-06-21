"use client"

import { Button } from '@/components/ui/button';

import { SearchSection } from '@/components/ui/search-section';
import { MovieCard } from '@/components/movie/movie-card';

import { PageHeader } from '@/components/ui/page-header';
import { useState } from 'react';

import { mockMovies } from '@/mock/movies';

export default function MoviesPage() {
  const [query, setQuery] = useState('');
  const movies = mockMovies;

  // Replace with proper search logic with debouncing and back-end
  const filteredMovies = movies.filter((movie: { title: string }) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="mx-auto px-4 py-8">
      {/* Page Header */}
      <PageHeader title="Movies" description="Browse our collection of movies" />

      {/* Search */}
      <SearchSection
        placeholder="Search movies..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* Movies Grid */}
      <div className="mt-6 grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={Number(movie.id)}
            name={movie.title}
            rating={Number(movie.rating)}
            actors={movie.actors.map(actor => ({
              id: Number(actor.id),
              name: actor.name,
            }))}
          />
        ))}
      </div>

      {/* Pagination (replace with hook and component) */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-primary/10">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
