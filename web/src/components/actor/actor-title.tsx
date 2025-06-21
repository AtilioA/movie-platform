'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ActorTitleProps {
  id: number | string;
  name: string;
  className?: string;
}

export function ActorTitle({ id, name, className }: ActorTitleProps) {
  return (
    <Link 
      href={`/actors/${id}`} 
      className={cn(
        'hover:underline',
        className
      )}
    >
      {name}
    </Link>
  );
}
