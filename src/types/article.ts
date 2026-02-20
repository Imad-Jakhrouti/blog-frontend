import { CommentResponse } from './comment'

export interface ArticleResponse {
  id: number
  title: string
  content: string
  slug: string
  author: string
  createdAt: string
  likeCount: number
  commentCount: number
  likedByCurrentUser: boolean
}

export interface ArticleDetailsResponse {
  id: number
  title: string
  content: string
  slug: string
  author: string
  createdAt: string
  likeCount: number
  likedByCurrentUser: boolean
  comments: CommentResponse[]
}

export interface MyArticleResponse {
  id: number
  title: string
  slug: string
  contentPreview: string
  createdAt: string
  likeCount: number
  commentCount: number
}

export interface CreateArticleRequest {
  title: string
  content: string
}

export interface UpdateArticleRequest {
  title: string
  content: string
}