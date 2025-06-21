"use client"

import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter, Search, SlidersHorizontal, Star } from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '@/components/movie/movie-card';

export default function MoviesPage() {
  // Mock data - will be replaced with actual API calls
  const movies = Array(12).fill(0).map((_, i) => ({
    id: i + 1,
    title: `Movie Title ${i + 1}`,
    rating: (Math.random() * 10).toFixed(1),
    actors: Array(Math.floor(Math.random() * 5) + 2).fill(0).map((_, j) => ({
      id: j + 1,
      name: `Actor ${j + 1}`,
    })),
  }));

  return (
    <main className="mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
        <p className="text-muted-foreground mt-2">
          Browse our collection of movies
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-full flex-col">
                <InputWithIcon
                  icon={<Search />}
                  type="text"
                  placeholder="Search"
                  className="peer block w-full rounded-md border py-[9px] pl-10 text-sm"
                />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Movies Grid */}
      <div className="mt-6 grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            name={movie.title}
            rating={Number(movie.rating)}
            actors={movie.actors}
          />
        ))}
      </div>

      {/* Pagination */}
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
