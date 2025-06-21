'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { queryClient } from '@/lib/react-query';

type QueryProviderProps = {
  children: ReactNode;
  showDevTools?: boolean;
};

export function QueryProvider({ children, showDevTools = false }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevTools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
