import { ReactNode } from 'react';
import { PageHeader } from '@/components/ui/page-header';

export default function MoviesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Movies"
        description="Browse our collection of movies"
      />
      {children}
    </div>
  );
}
