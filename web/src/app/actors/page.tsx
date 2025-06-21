import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, SlidersHorizontal, User } from 'lucide-react';
import Link from 'next/link';

export default function ActorsPage() {
  // Mock data - will be replaced with actual API calls
  const actors = Array(12).fill(0).map((_, i) => ({
    id: i + 1,
    name: `Actor ${String.fromCharCode(65 + i)}`,
    movieCount: Math.floor(Math.random() * 30) + 5,
  }));

  return (
    <main className="mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Actors</h1>
        <p className="text-muted-foreground mt-2">
          Browse our collection of talented actors
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search actors..."
                  className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Actors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {actors.map((actor) => (
          <Link key={actor.id} href={`/actors/${actor.id}`} className="group">
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg text-center">
              <div className="relative pt-[100%] bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="h-16 w-16 text-muted-foreground/20" />
                </div>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold">
                  {actor.name}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {actor.movieCount} movies
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                </div>
              </CardHeader>
            </Card>
          </Link>
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
