import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ActorTitle } from "./actor-title";

export interface ActorCardProps {
  id: string;
  name: string;
  movieCount?: number;
  className?: string;
}

export function ActorCard({ id, name, movieCount, className }: ActorCardProps) {
  // Show initials
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Card className={cn("h-full overflow-hidden transition-all hover:shadow-lg text-center group", className)}>
      <div className="flex items-center justify-center pt-6 pb-2">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-2 group-hover:bg-muted/80 transition-colors">
          {initials}
        </div>
      </div>
      <CardHeader className="p-4">
        <ActorTitle id={id} name={name} className="text-lg font-semibold" />
        {typeof movieCount === "number" && (
          <div className="text-sm text-muted-foreground">{movieCount} {movieCount === 1 ? 'movie' : 'movies'}</div>
        )}
      </CardHeader>
    </Card>
  );
}
