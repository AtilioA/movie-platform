import { notFound } from 'next/navigation';
import { Star } from "lucide-react";
import { ActorCard } from "@/components/actor/actor-card";
import { Card } from '@/components/ui/card';

// Mock data - will be replaced with actual API call
async function getMovieById(id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const movies = [
    {
      id: '1',
      title: 'Inception',
      rating: 8.8,
      actors: Array.from({ length: 6 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Ator ${String.fromCharCode(65 + i)}`,
      })),
    },
  ];
  const movie = movies.find(movie => movie.id === id);
  if (!movie) return null;
  return movie;
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) {
    notFound();
  }
  const actors = movie.actors || [];
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{movie.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span>{movie.rating}/10</span>
        </div>
      </div>
      <div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {actors.map((actor: { id: string; name: string }) => (
              <ActorCard key={actor.id} id={actor.id} name={actor.name} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
