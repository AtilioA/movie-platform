import { ReactNode } from 'react';
import { PageHeader } from '@/components/ui/page-header';

export default function ActorsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Actors" 
        description="Browse our collection of talented actors" 
      />
      {children}
    </div>
  );
}
