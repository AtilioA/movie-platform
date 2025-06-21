import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data - will be replaced with actual API call
async function getActor(id: string) {
  await new Promise(resolve => setTimeout(resolve, 100));

  const actors = [
    {
      id: '1',
      name: 'Leonardo DiCaprio',
      movies: [
        { id: 1, title: 'Inception', year: 2010, },
        { id: 2, title: 'The Revenant', year: 2015, },
        { id: 3, title: 'The Wolf of Wall Street', year: 2013, },
        { id: 4, title: 'Titanic', year: 1997, },
      ]
    },
  ];

  const actor = actors.find(actor => actor.id === id);
  if (!actor) return null;

  return actor;
}

export default async function ActorDetailPage({ params }: { params: { id: string } }) {
  const actor = await getActor(params.id);

  if (!actor) {
    notFound();
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/actors" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Actors
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Actor Details */}
        <div className="md:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{actor.name}</h1>

            <div className="mt-4 space-y-2">
              <div className="text-muted-foreground">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
