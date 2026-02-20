'use client'

import { Box, IconButton, Typography } from '@mui/material'
import { Favorite as LikedIcon, FavoriteBorder as LikeIcon } from '@mui/icons-material'
import { useLikeArticle } from '../hooks/useArticleDetail'
import { ArticleDetailsResponse } from '@/types'

interface LikeButtonProps {
  article: ArticleDetailsResponse
  slug: string
}

export default function LikeButton({ article, slug }: LikeButtonProps) {
  const { like, unlike } = useLikeArticle(slug)

  const isLoading = like.isPending || unlike.isPending

  const handleToggle = () => {
    if (isLoading) return
    if (article.likedByCurrentUser) {
      unlike.mutate(article.id)
    } else {
      like.mutate(article.id)
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <IconButton
        onClick={handleToggle}
        disabled={isLoading}
        size="small"
        sx={{
          color: article.likedByCurrentUser ? '#E8623A' : 'text.disabled',
          transition: 'transform 0.15s ease, color 0.15s ease',
          '&:hover': {
            color: '#E8623A',
            transform: 'scale(1.15)',
            bgcolor: 'rgba(232, 98, 58, 0.08)',
          },
          '&:active': { transform: 'scale(0.95)' },
        }}
      >
        {article.likedByCurrentUser ? (
          <LikedIcon sx={{ fontSize: 22 }} />
        ) : (
          <LikeIcon sx={{ fontSize: 22 }} />
        )}
      </IconButton>
      <Typography
        variant="body2"
        fontWeight={article.likedByCurrentUser ? 600 : 400}
        color={article.likedByCurrentUser ? '#E8623A' : 'text.secondary'}
      >
        {article.likeCount} {article.likeCount === 1 ? 'like' : 'likes'}
      </Typography>
    </Box>
  )
}