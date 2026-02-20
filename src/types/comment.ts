export interface CommentResponse {
  id: number
  content: string
  author: string
  createdAt: string
}

export interface CreateCommentRequest {
  content: string
}

export interface UpdateCommentRequest {
  content: string
}