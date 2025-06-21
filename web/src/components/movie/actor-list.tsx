'use client';

import { cn } from '@/lib/utils';

interface Actor {
  id: string;
  name: string;
}

interface ActorListProps {
  actors: Actor[];
  maxVisible?: number;
  className?: string;
}

export function ActorList({
  actors,
  maxVisible = 3,
  className
}: ActorListProps) {
  if (actors.length === 0) return null;

  const visibleActors = actors.slice(0, maxVisible);
  const remainingActorsCount = Math.max(0, actors.length - maxVisible);

  return (
    <div className={cn('mt-auto pt-3 border-t border-border', className)}>
      <h4 className="text-xs font-medium text-muted-foreground mb-2">
        Starring {remainingActorsCount > 0 && `(${actors.length} total)`}
      </h4>
      <div className="space-y-1">
        {visibleActors.map((actor) => (
          <div key={actor.id} className="text-sm text-foreground/90 truncate">
            {actor.name}
          </div>
        ))}
        {remainingActorsCount > 0 && (
          <div className="text-xs text-muted-foreground pt-0.5">
            + {remainingActorsCount} more
          </div>
        )}
      </div>
    </div>
  );
}
