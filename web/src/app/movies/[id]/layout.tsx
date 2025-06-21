import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function MovieLayout({ children }: { children: React.ReactNode }) {
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
      <Suspense fallback={<div><LoadingSkeleton /></div>}>
        {children}
      </Suspense>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/2 mb-4" />
      <Skeleton className="h-6 w-1/3 mb-2" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
