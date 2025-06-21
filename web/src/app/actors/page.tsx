"use client"

import { Button } from '@/components/ui/button';
import { SearchSection } from '@/components/ui/search-section';
import { ActorCard } from "@/components/actor/actor-card";
import { PageHeader } from '@/components/ui/page-header';
import { useState } from 'react';
import { getAllActors } from '@/mock/actors';

export default function ActorsPage() {
  const [query, setQuery] = useState('');
  const actors = getAllActors().map(actor => ({
    id: actor.id,
    name: actor.name,
    movieCount: actor.movies.length,
  }));
  const filteredActors = actors.filter(actor =>
    actor.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="mx-auto px-4 py-8">
      {/* Page Header */}
      <PageHeader title="Actors" description="Browse our collection of talented actors" />

      {/* Search */}
      <SearchSection
        placeholder="Search actors..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* Actors Grid */}
      <div className="mt-6 grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredActors.map((actor) => (
          <ActorCard
            key={actor.id}
            id={String(actor.id)}
            name={actor.name}
            movieCount={actor.movieCount}
            href={`/actors/${String(actor.id)}`}
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
