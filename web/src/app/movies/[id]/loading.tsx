import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      {/* Movie details skeletons */}
      <Skeleton className="h-8 w-1/4 mb-4" />
      <Skeleton className="h-5 w-1/16 mb-5" />
      <h2 className="text-2xl font-semibold mb-4">Cast</h2>
      {/* Cast grid skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
