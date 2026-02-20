import { api } from '@/lib/api/client'
import {
  ArticleResponse,
  ArticleDetailsResponse,
  MyArticleResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
  PageResponse,
} from '@/types'

// ─── Paramètres de pagination ───────────────────────────────────────────────

export interface GetArticlesParams {
  page?: number   // 0-indexed (Spring Boot convention)
  size?: number
  sort?: string   // ex: "createdAt,desc"
}

// ─── Endpoints publics ───────────────────────────────────────────────────────

/**
 * Liste paginée de tous les articles
 * GET /articles?page=0&size=10&sort=createdAt,desc
 */
export async function getArticles(
  params: GetArticlesParams = {}
): Promise<PageResponse<ArticleResponse>> {
  const { page = 0, size = 10, sort = 'createdAt,desc' } = params
  const { data } = await api.get<PageResponse<ArticleResponse>>('/articles', {
    params: { page, size, sort },
  })
  return data
}

/**
 * Détail d'un article par slug
 * GET /articles/{slug}
 */
export async function getArticleBySlug(
  slug: string
): Promise<ArticleDetailsResponse> {
  const { data } = await api.get<ArticleDetailsResponse>(`/articles/${slug}`)
  return data
}

// ─── Endpoints authentiifiés ─────────────────────────────────────────────────

/**
 * Mes articles (AUTHOR / ADMIN)
 * GET /articles/me?page=0&size=10
 */
export async function getMyArticles(
  params: GetArticlesParams = {}
): Promise<PageResponse<MyArticleResponse>> {
  const { page = 0, size = 10, sort = 'createdAt,desc' } = params
  const { data } = await api.get<PageResponse<MyArticleResponse>>('/articles/me', {
    params: { page, size, sort },
  })
  return data
}

/**
 * Créer un article (AUTHOR / ADMIN)
 * POST /articles
 */
export async function createArticle(
  body: CreateArticleRequest
): Promise<ArticleResponse> {
  const { data } = await api.post<ArticleResponse>('/articles', body)
  return data
}

/**
 * Modifier un article (AUTHOR propriétaire / ADMIN)
 * PUT /articles/{id}
 */
export async function updateArticle(
  id: number,
  body: UpdateArticleRequest
): Promise<ArticleResponse> {
  const { data } = await api.put<ArticleResponse>(`/articles/${id}`, body)
  return data
}

/**
 * Supprimer un article (AUTHOR propriétaire / ADMIN)
 * DELETE /articles/{id}
 */
export async function deleteArticle(id: number): Promise<void> {
  await api.delete(`/articles/${id}`)
}

// ─── Likes ───────────────────────────────────────────────────────────────────

/**
 * Liker un article
 * POST /articles/{id}/like
 */
export async function likeArticle(id: number): Promise<void> {
  await api.post(`/articles/${id}/like`)
}

/**
 * Unliker un article
 * DELETE /articles/{id}/like
 */
export async function unlikeArticle(id: number): Promise<void> {
  await api.delete(`/articles/${id}/like`)
}