'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, ReactNode } from 'react'

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  // useState garantit un QueryClient unique par session (pas de singleton global)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Ne re-fetch pas automatiquement quand on revient sur l'onglet
            refetchOnWindowFocus: false,
            // Retry 1 fois en cas d'erreur réseau
            retry: 1,
            // Données considérées fraîches pendant 1 min par défaut
            staleTime: 1000 * 60,
          },
          mutations: {
            // Pas de retry automatique sur les mutations
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools visibles uniquement en dev */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}