'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SearchSection } from '@/components/ui/search-section';
import { MovieCard } from '@/components/movie/movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { useMovies } from '@/features/movies/hooks/use-movies';
import type { Movie } from '@/types/movie.types';

const ITEMS_PER_PAGE = 10;

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10) || 1;
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);

      // Update URL with debounced search
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      } else {
        params.delete('q');
      }
      // Reset to first page when search changes
      params.delete('page');

      router.push(`${pathname}?${params.toString()}`);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery, pathname, router, searchParams]);

  // Update local state when URL changes (back/forward navigation)
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Use the custom hook to fetch movies with debounced search
  const {
    data,
    isLoading,
    isError,
    isFetching
  } = useMovies({
    query: debouncedSearch,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, router, searchParams]);

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-red-600">Error loading movies</h2>
          <p className="text-muted-foreground mt-2">
            We couldn&apos;t load the movies. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Safely access paginated data with fallbacks
  const movies = data?.data.data || [];
  const meta = data?.data.meta;
  const totalItems = meta?.total || 0;
  const limit = meta?.limit || 10;
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-80">
          <SearchSection
            initialQuery={searchQuery}
            onSearch={handleSearch}
            placeholder="Search movies..."
          />
          {!isLoading && !isFetching && (
            <p className="text-muted-foreground mt-1">
              {totalItems} {totalItems === 1 ? 'movie' : 'movies'} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          )}
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                name={movie.title}
                rating={Number(movie.averageRating)}
                actors={movie.actors?.map(actor => ({
                  id: actor.id,
                  name: actor.name,
                }))}
                className="h-full"
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="justify-center"
            />
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} movies
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">No movies found</h2>
          <p className="text-muted-foreground mt-2">
            {searchQuery
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'There are no movies available at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
}
