'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';
import { ActorList } from './actor-list';
import { MovieTitle } from './movie-title';

interface MovieCardProps {
  id: string;
  name: string;
  rating?: number; // 1-5 rating
  actors?: Array<{
    id: string;
    name: string;
  }>;
  className?: string;
}

export function MovieCard({
  id,
  name,
  rating,
  actors,
  className,
}: MovieCardProps) {
  return (
    <Card className={cn(
      'group h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg',
      className
    )}>
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <MovieTitle id={id} name={name} />
        </div>

        <div className="mb-4">
          <RatingStars rating={rating || 0} />
        </div>

        <ActorList actors={actors || []} />
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
