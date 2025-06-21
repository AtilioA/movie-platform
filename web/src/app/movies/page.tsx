"use client";

import { Button } from '@/components/ui/button';
import { SearchSection } from '@/components/ui/search-section';
import { MovieCard } from '@/components/movie/movie-card';
import { useState, useEffect } from 'react';
import { mockMovies } from '@/mock/movies';
import { Skeleton } from '@/components/ui/skeleton';

// Simulate a delay for loading
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getMoviesWithDelay() {
  await delay(1000); // 1000ms delay
  return mockMovies;
}

function MoviesGrid() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<typeof mockMovies>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load movies with delay
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const moviesData = await getMoviesWithDelay();
        setMovies(moviesData);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Filter movies based on search query
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <SearchSection
        placeholder="Search movies..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* Movies Grid */}
      {isLoading ? (
        <MoviesGridSkeleton />
      ) : (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      )}

      {/* Pagination */}
      {!isLoading && <Pagination />}
    </div>
  );
}

function Pagination() {
  return (
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
  );
}

function MoviesGridSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[9/10] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MoviesPage() {
  return <MoviesGrid />;
}
