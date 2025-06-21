"use client";

import { Button } from '@/components/ui/button';
import { SearchSection } from '@/components/ui/search-section';
import { ActorCard } from "@/components/actor/actor-card";
import { useState, useEffect } from 'react';
import { getAllActors } from '@/mock/actors';
import { Skeleton } from '@/components/ui/skeleton';

// Simulate a delay for loading
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getActorsWithDelay() {
  await delay(1000);
  return getAllActors().map(actor => ({
    id: actor.id,
    name: actor.name,
    movieCount: actor.movies.length,
  }));
}

function ActorsGrid() {
  const [query, setQuery] = useState('');
  const [actors, setActors] = useState<{ id: string, name: string, movieCount: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load actors with delay
  useEffect(() => {
    const loadActors = async () => {
      try {
        setIsLoading(true);
        const actorsData = await getActorsWithDelay();
        setActors(actorsData);
      } catch (error) {
        console.error('Failed to load actors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActors();
  }, []);

  const filteredActors = actors.filter(actor =>
    actor.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <SearchSection
        placeholder="Search actors..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* Actors Grid */}
      {isLoading ? (
        <ActorsGridSkeleton />
      ) : (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredActors.map((actor) => (
            <ActorCard
              key={actor.id}
              id={String(actor.id)}
              name={actor.name}
              movieCount={actor.movieCount}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination />
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

function ActorsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActorsPage() {
  return <ActorsGrid />;
}
