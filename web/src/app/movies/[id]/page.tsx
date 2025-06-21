import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Film, Star } from 'lucide-react';
import Link from 'next/link';

// Mock data - will be replaced with actual API call
async function getMovie(id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const movies = [
    {
      id: '1',
      title: 'Inception',
      rating: 8.8,
    },
  ];

  const movie = movies.find(movie => movie.id === id);
  if (!movie) return null;

  return movie;
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = await getMovie(params.id);

  if (!movie) {
    notFound();
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/movies" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Movies
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Movie Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{movie.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>{movie.rating}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
