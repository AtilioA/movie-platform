"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="bg-white shadow-sm dark:bg-gray-900 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Movie Platform
            </Link>
          </div>
          <div className="hidden sm:ml-8 sm:flex">
            <Link
              href="/movies"
              className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ease-in-out border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white dark:hover:border-blue-500 mx-8"
            >
              Movies
            </Link>
            <Link
              href="/actors"
              className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ease-in-out border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white dark:hover:border-blue-500"
            >
              Actors
            </Link>
            <div className="hidden md:flex items-center">
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-4"></div>
              <Link
                href="/login"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden ml-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div
        className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white dark:bg-gray-900 shadow-lg ${isMenuOpen ? 'max-h-64' : 'max-h-0'}`}
        id="mobile-menu"
      >
        <div className="space-y-1 pb-3 pt-2">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/movies"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/actors"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
            >
              Actors
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
