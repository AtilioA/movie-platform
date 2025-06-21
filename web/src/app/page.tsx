"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/movie/movie-card';

export default function Home() {
  // Mock data for featured movies with actors
  const featuredMovies = [
    {
      id: 1,
      name: 'Inception',
      rating: 8.8,
      actors: [
        { id: 101, name: 'Leonardo DiCaprio' },
        { id: 102, name: 'Joseph Gordon-Levitt' },
        { id: 103, name: 'Ellen Page' },
        { id: 104, name: 'Tom Hardy' },
      ],
    },
    {
      id: 2,
      name: 'The Shawshank Redemption',
      rating: 9.3,
      actors: [
        { id: 201, name: 'Tim Robbins' },
        { id: 202, name: 'Morgan Freeman' },
        { id: 203, name: 'Bob Gunton' },
      ],
    },
    {
      id: 3,
      name: 'The Dark Knight',
      rating: 9.0,
      actors: [
        { id: 301, name: 'Christian Bale' },
        { id: 302, name: 'Heath Ledger' },
        { id: 303, name: 'Aaron Eckhart' },
        { id: 304, name: 'Michael Caine' },
        { id: 305, name: 'Gary Oldman' },
      ],
    },
    {
      id: 4,
      name: 'Pulp Fiction',
      rating: 8.9,
      actors: [
        { id: 401, name: 'John Travolta' },
        { id: 402, name: 'Samuel L. Jackson' },
        { id: 403, name: 'Uma Thurman' },
        { id: 404, name: 'Bruce Willis' },
      ],
    },
    {
      id: 5,
      name: 'The Godfather',
      rating: 9.2,
      actors: [
        { id: 501, name: 'Marlon Brando' },
        { id: 502, name: 'Al Pacino' },
        { id: 503, name: 'James Caan' },
        { id: 504, name: 'Robert Duvall' },
      ],
    },
  ];

  // Mock data for popular actors
  const popularActors = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Actor ${i + 1}`,
    movieCount: (i + 1) * 5 + 10,
  }));

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24 xl:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Discover <span className="text-blue-200">movies</span> & <span className="text-blue-200">actors</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl text-blue-100">
                Explore a vast collection of movies and actors, read reviews, and find your next favorite film. Our platform brings the world of cinema to your fingertips.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 px-4 sm:px-0">
                <Button asChild className="bg-white text-blue-700 hover:bg-blue-50 h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto transition-all duration-200 hover:scale-105 transform">
                  <Link href="/movies" className="font-semibold">
                    Browse movies
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30 text-white transition-all duration-200 hover:scale-105 transform">
                  <Link href="/actors" className="font-semibold">
                    Browse actors
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              {/* Hero image or illustration can be placed here */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured movies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Featured movies
          </h2>
          <Link href="/movies" className="text-blue-700 hover:underline font-medium">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              name={movie.name}
              rating={movie.rating}
              actors={movie.actors}
            />
          ))}
        </div>
      </section>

      {/* Popular actors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Popular actors
          </h2>
          <Link href="/actors" className="text-blue-700 hover:underline font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-6">
          {popularActors.map((actor) => (
            <div key={actor.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-2">
                {actor.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="font-medium">{actor.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{actor.movieCount} movies</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
