import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Movie title skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-1/2 mb-4" />
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-24 ml-1" />
          </div>
        </div>
      </div>

      {/* Cast section skeleton */}
      <div className="mb-12">
        <Skeleton className="h-7 w-24 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-40 rounded-lg" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Ratings section skeleton */}
      <div className="mb-12">
        <Skeleton className="h-7 w-24 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-4 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
