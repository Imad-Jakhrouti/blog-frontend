import { api } from '@/lib/api/client'
import { CommentResponse, CreateCommentRequest, UpdateCommentRequest, PageResponse } from '@/types'

/**
 * GET /api/articles/{slug}/comments
 */
export async function getComments(slug: string, page = 0, size = 20): Promise<PageResponse<CommentResponse>> {
  const { data } = await api.get<PageResponse<CommentResponse>>(
    `/articles/${slug}/comments`,
    { params: { page, size } }
  )
  return data
}

/**
 * POST /api/articles/{slug}/comments
 */
export async function addComment(slug: string, body: CreateCommentRequest): Promise<CommentResponse> {
  const { data } = await api.post<CommentResponse>(`/articles/${slug}/comments`, body)
  return data
}

/**
 * PUT /api/articles/{slug}/comments/{id}
 */
export async function updateComment(slug: string, commentId: number, body: UpdateCommentRequest): Promise<CommentResponse> {
  const { data } = await api.put<CommentResponse>(`/articles/${slug}/comments/${commentId}`, body)
  return data
}

/**
 * DELETE /api/articles/{slug}/comments/{id}
 */
export async function deleteComment(slug: string, commentId: number): Promise<void> {
  await api.delete(`/articles/${slug}/comments/${commentId}`)
}