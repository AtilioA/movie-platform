import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Film, Star, User } from 'lucide-react';
import Link from 'next/link';

// Mock data - will be replaced with actual API call
async function getActor(id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const actors = [
    {
      id: '1',
      name: 'Leonardo DiCaprio',
      birthDate: 'November 11, 1974',
      birthPlace: 'Los Angeles, California, USA',
      bio: 'Leonardo Wilhelm DiCaprio is an American actor and film producer. Known for his work in biopics and period films, DiCaprio has received numerous accolades, including an Academy Award, a British Academy Film Award, and three Golden Globe Awards.',
      knownFor: ['Inception', 'The Revenant', 'The Wolf of Wall Street', 'Titanic'],
      movies: [
        { id: 1, title: 'Inception', year: 2010, role: 'Cobb' },
        { id: 2, title: 'The Revenant', year: 2015, role: 'Hugh Glass' },
        { id: 3, title: 'The Wolf of Wall Street', year: 2013, role: 'Jordan Belfort' },
        { id: 4, title: 'Titanic', year: 1997, role: 'Jack Dawson' },
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
        {/* Actor Photo */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="aspect-square bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-24 w-24 text-muted-foreground/20" />
              </div>
            </div>
          </Card>
        </div>

        {/* Actor Details */}
        <div className="md:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{actor.name}</h1>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Born: {actor.birthDate}</span>
              </div>
              <div className="text-muted-foreground">
                {actor.birthPlace}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Known For</h3>
              <div className="flex flex-wrap gap-2">
                {actor.knownFor.map((movie, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {movie}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">Biography</h2>
              <p className="text-muted-foreground">{actor.bio}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Known For Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Known For</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {actor.movies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-[2/3] bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <Button variant="default" size="sm" className="w-full">
                      View
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium line-clamp-1">{movie.title}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{movie.year}</span>
                    <span className="text-foreground">{movie.role}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
