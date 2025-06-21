'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MovieTitleProps {
  id: number;
  name: string;
  className?: string;
  linkClassName?: string;
}

export function MovieTitle({ 
  id, 
  name, 
  className, 
  linkClassName = 'text-red-500 hover:underline focus:underline' 
}: MovieTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors flex-1 min-w-0 pr-2', className)}>
      <Link href={`/movies/${id}`} className={linkClassName}>
        {name}
      </Link>
    </h3>
  );
}
