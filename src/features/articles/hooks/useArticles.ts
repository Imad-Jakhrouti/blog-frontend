import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getArticles, GetArticlesParams } from '../api/articleApi'
import { ArticleResponse, PageResponse } from '@/types'

// ─── Query Keys ──────────────────────────────────────────────────────────────
// Centralisés ici pour éviter les typos et faciliter l'invalidation

export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (params: GetArticlesParams) => [...articleKeys.lists(), params] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
  myArticles: (params: GetArticlesParams) => ['my-articles', params] as const,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseArticlesOptions extends GetArticlesParams {
  enabled?: boolean
}

/**
 * Hook React Query pour récupérer la liste paginée des articles.
 *
 * Usage :
 * const { data, isLoading, isError } = useArticles({ page: 0, size: 10 })
 *
 * data.content    → ArticleResponse[]
 * data.totalPages → nombre total de pages
 * data.totalElements → nombre total d'articles
 */
export function useArticles(options: UseArticlesOptions = {}) {
  const { page = 0, size = 10, sort = 'createdAt,desc', enabled = true } = options

  const params: GetArticlesParams = { page, size, sort }

  return useQuery<PageResponse<ArticleResponse>, Error>({
    queryKey: articleKeys.list(params),
    queryFn: () => getArticles(params),
    enabled,
    // Garde les données précédentes pendant le chargement de la nouvelle page
    // → évite le flash blanc lors de la pagination
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutes avant de re-fetch
  })
}