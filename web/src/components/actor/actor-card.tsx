import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export interface ActorCardProps {
  id: number | string;
  name: string;
  movieCount?: number;
  href?: string; // Optional link to actor detail
}

export function ActorCard({ id, name, movieCount, href }: ActorCardProps) {
  // Show initials
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const content = (
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg text-center">
      <div className="flex items-center justify-center pt-6 pb-2">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-2">
          {initials}
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        {typeof movieCount === "number" && (
          <div className="text-sm text-muted-foreground">{movieCount} movies</div>
        )}
      </CardHeader>
    </Card>
  );
  return href ? <Link href={href} className="group">{content}</Link> : content;
}
