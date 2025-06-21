import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getActorById } from '@/mock/actors';
import { MovieCard } from '@/components/movie/movie-card';

// Get actor data from our mock data
async function getActor(id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const actor = getActorById(id);
  if (!actor) return null;

  return actor;
}

export default async function ActorDetailPage({ params }: { params: { id: string } }) {
  const actor = await getActor(params.id);

  if (!actor) {
    notFound();
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/actors" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Actors
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Actor Details */}
        <div className="md:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{actor.name}</h1>

            <div className="mt-4 space-y-2">
              <div className="text-muted-foreground">
                {actor.movies.length} {actor.movies.length === 1 ? 'movie' : 'movies'}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Movies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {actor.movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      id={parseInt(movie.id, 10)}
                      name={movie.title}
                      rating={movie.rating || 8.0}
                      actors={[{ id: parseInt(actor.id, 10), name: actor.name }]}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
