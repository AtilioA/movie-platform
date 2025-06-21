'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number; // Rating out of 5
  className?: string;
  starSize?: number;
  showText?: boolean;
}

export function RatingStars({
  rating,
  className,
  starSize = 4,
  showText = true
}: RatingStarsProps) {
  const ratingOutOfFive = rating.toFixed(1);

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              `w-${starSize} h-${starSize}`,
              i < Math.round(rating / 2)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-muted-foreground/30 fill-muted-foreground/10'
            )}
          />
        ))}
      </div>
      {showText && (
        <span className="ml-1.5 text-sm font-medium text-muted-foreground">
          {ratingOutOfFive}/5
        </span>
      )}
    </div>
  );
}
