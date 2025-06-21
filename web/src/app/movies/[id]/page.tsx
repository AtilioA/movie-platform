import { notFound } from 'next/navigation';
import { Star } from "lucide-react";
import { ActorCard } from "@/components/actor/actor-card";
import { getMovieById } from '@/services/movie-service';

export const revalidate = 3600; // Revalidate data at most every hour

export default async function MovieDetailPage({
  params
}: {
  params: { id: string }
}) {
  try {
    const movie = await getMovieById(params.id);

    // NOTE: this should be performed by the backend; for simplicity, we are doing it here
    // Calculate average rating
    const averageRating = movie.ratings.length > 0
      ? (movie.ratings.reduce((sum, r) => sum + r.score, 0) / movie.ratings.length).toFixed(1)
      : 'N/A';

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{movie.title}</h1>

          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{averageRating} / 5</span>
              <span className="text-sm ml-1">({movie.ratings?.length || 0} ratings)</span>
            </div>
          </div>
        </div>

        {movie.actors?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.actors?.map((actor) => (
                <ActorCard
                  key={actor.id}
                  id={actor.id}
                  name={actor.name}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Ratings</h2>
          </div>

          {movie.ratings?.length > 0 ? (
            <div className="space-y-4">
              {movie.ratings.map((rating) => (
                <div key={rating.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < rating.score ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm mt-2">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No ratings yet.</p>
          )}
        </div>
      </div>
    );
  } catch (error: unknown) {
    console.error('Error fetching movie:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const movie = await getMovieById(params.id);
    if (!movie) return {};

    return {
      title: `${movie.title} | Movie Platform`,
      description: `View details about ${movie.title} including cast and ratings.`,
    };
  } catch (_error: unknown) {
    return {
      title: 'Movie Details',
      description: 'View movie details',
    };
  }
}
