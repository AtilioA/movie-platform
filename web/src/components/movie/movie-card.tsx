'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface MovieCardProps {
  id: number;
  name: string;
  rating: number; // 1-5 rating
  actors: Array<{
    id: number;
    name: string;
  }>;
  className?: string;
}

function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Great';
  if (rating >= 3) return 'Good';
  if (rating >= 2) return 'Fair';
  return 'Poor';
}

export function MovieCard({
  id,
  name,
  rating,
  actors,
  className,
}: MovieCardProps) {
  const maxVisibleActors = 3;
  const visibleActors = actors.slice(0, maxVisibleActors);
  const remainingActorsCount = Math.max(0, actors.length - maxVisibleActors);
  const ratingOutOfFive = (rating / 2).toFixed(1); // Convert 10-point scale to 5-point

  return (
    <Card className={cn(
      'group overflow-hidden transition-all duration-300 hover:shadow-lg',
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/movies/${id}`} className="text-xs text-red-500 hover:underline focus:underline">
                {name}
              </Link>
            </h3>
            <div className="flex items-center mt-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < Math.round(rating / 2)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted-foreground/30 fill-muted-foreground/10'
                    )}
                  />
                ))}
                <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                  {ratingOutOfFive}/5
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs h-5">
            {getRatingLabel(Number(ratingOutOfFive))}
          </Badge>
        </div>

        {actors.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-1.5">
              Starring {remainingActorsCount > 0 && `(${actors.length} total)`}
            </h4>
            <div className="space-y-1.5">
              {visibleActors.map((actor) => (
                <div key={actor.id} className="text-sm text-foreground/90">
                  {actor.name}
                </div>
              ))}
              {remainingActorsCount > 0 && (
                <div className="text-xs text-muted-foreground pt-1">
                  + {remainingActorsCount} more
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] bg-muted/50 rounded-lg mb-3"></div>
      <div className="h-4 bg-muted/50 rounded w-3/4 mb-2"></div>
      <div className="flex justify-between">
        <div className="h-3 bg-muted/50 rounded w-1/4"></div>
        <div className="h-5 bg-muted/50 rounded-full w-12"></div>
      </div>
    </div>
  );
}
