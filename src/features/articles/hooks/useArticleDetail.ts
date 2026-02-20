import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getArticleBySlug, likeArticle, unlikeArticle } from '../api/articleApi'
import { addComment, deleteComment, updateComment } from '../api/commentApi'
import { articleKeys } from './useArticles'
import { ArticleDetailsResponse } from '@/types'

export function useArticleDetail(slug: string) {
  return useQuery<ArticleDetailsResponse, Error>({
    queryKey: articleKeys.detail(slug),
    queryFn: () => getArticleBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60,
  })
}

export function useLikeArticle(slug: string) {
  const queryClient = useQueryClient()

  const updateCache = (liked: boolean) => {
    queryClient.setQueryData<ArticleDetailsResponse>(
      articleKeys.detail(slug),
      (old) => !old ? old : {
        ...old,
        likedByCurrentUser: liked,
        likeCount: liked ? old.likeCount + 1 : old.likeCount - 1,
      }
    )
  }

  const like = useMutation({
    mutationFn: (id: number) => likeArticle(id),
    onMutate: () => updateCache(true),
    onError: () => updateCache(false),
    onSettled: () => queryClient.invalidateQueries({ queryKey: articleKeys.detail(slug) }),
  })

  const unlike = useMutation({
    mutationFn: (id: number) => unlikeArticle(id),
    onMutate: () => updateCache(false),
    onError: () => updateCache(true),
    onSettled: () => queryClient.invalidateQueries({ queryKey: articleKeys.detail(slug) }),
  })

  return { like, unlike }
}

export function useAddComment(slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => addComment(slug, { content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.detail(slug) }),
  })
}

export function useDeleteComment(slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(slug, commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.detail(slug) }),
  })
}

export function useUpdateComment(slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(slug, commentId, { content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.detail(slug) }),
  })
}   