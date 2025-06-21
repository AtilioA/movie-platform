import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Film, User } from 'lucide-react';

export function Hero() {
  return (
    <section className="min-h-screen max-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
      <div className="absolute inset-0" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            <span className="text-blue-200">Movie</span> & <span className="text-blue-200">Actor</span> Platform
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Explore the world of cinema through our extensive collection of movies and actors
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild className="bg-white text-blue-700 hover:bg-blue-50 h-14 px-8 text-lg w-full sm:w-auto transition-all duration-200 hover:scale-105 transform flex items-center gap-3">
              <Link href="/movies" className="flex items-center gap-2">
                <Film className="w-5 h-5" />
                Browse Movies
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-transparent border-white/20 hover:bg-white/10 hover:border-white-30 text-white transition-all duration-200 hover:scale-105 transform flex items-center gap-3">
              <Link href="/actors" className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Browse Actors
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
