"use client"

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, SlidersHorizontal, User } from 'lucide-react';
import { SearchInput } from "@/components/ui/search-input";
import { ActorCard } from "@/components/actor/actor-card";
import Link from 'next/link';
import { useState } from 'react';

export default function ActorsPage() {
  // Mock data - will be replaced with actual API calls
  const actors = Array(12).fill(0).map((_, i) => ({
    id: i + 1,
    name: `Actor ${String.fromCharCode(65 + i)}`,
    movieCount: Math.floor(Math.random() * 30) + 5,
  }));

  const [query, setQuery] = useState('');
  const filteredActors = actors.filter(actor =>
    actor.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Actors</h1>
        <p className="text-muted-foreground mt-2">
          Browse our collection of talented actors
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-full">
                <SearchInput
                  placeholder="Search actors..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Actors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
