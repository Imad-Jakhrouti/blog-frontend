import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyArticles, deleteArticle, createArticle, updateArticle, GetArticlesParams } from '../api/articleApi'
import { MyArticleResponse, PageResponse, CreateArticleRequest, UpdateArticleRequest } from '@/types'

export const myArticleKeys = {
  all: ['my-articles'] as const,
  list: (params: GetArticlesParams) => [...myArticleKeys.all, params] as const,
}

export function useMyArticles(params: GetArticlesParams = {}) {
  const { page = 0, size = 10 } = params
  return useQuery<PageResponse<MyArticleResponse>, Error>({
    queryKey: myArticleKeys.list({ page, size }),
    queryFn: () => getMyArticles({ page, size }),
    staleTime: 1000 * 60,
  })
}

export function useCreateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateArticleRequest) => createArticle(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myArticleKeys.all }),
  })
}

export function useUpdateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateArticleRequest }) => updateArticle(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myArticleKeys.all }),
  })
}

export function useDeleteMyArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteArticle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myArticleKeys.all }),
  })
}