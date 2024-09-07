// app/providers.tsx
"use client";
import React, { ReactNode, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '@/context/UserContext';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

//const queryClient = new QueryClient();

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    console.log("GOOD MORNING");
    if (typeof window !== 'undefined') {
      const persister = createSyncStoragePersister({
        storage: window.localStorage,
      });

      console.log("hi");
      persistQueryClient({
        queryClient,
        persister,
      });
      console.log("cheng gong");
    } else {
      console.log("WHY??");
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}> 
      <SessionProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
