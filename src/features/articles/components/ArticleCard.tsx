'use client'

import { Box, Card, CardContent, Typography, Avatar, IconButton } from '@mui/material'
import {
  FavoriteBorder as LikeIcon,
  Favorite as LikedIcon,
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useState } from 'react'
import { likeArticle, unlikeArticle } from '../api/articleApi'
import { ArticleResponse } from '@/types'

interface ArticleCardProps {
  article: ArticleResponse
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = ['#6B9E78', '#C4956A', '#7B8EC8', '#C47A7A', '#8EC4C4']
function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // État local pour optimistic update sur la card
  const [liked, setLiked] = useState(article.likedByCurrentUser)
  const [likeCount, setLikeCount] = useState(article.likeCount)
  const [loading, setLoading] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // ne pas naviguer vers l'article
    if (loading) return
    setLoading(true)
    try {
      if (liked) {
        setLiked(false)
        setLikeCount((c) => c - 1)
        await unlikeArticle(article.id)
      } else {
        setLiked(true)
        setLikeCount((c) => c + 1)
        await likeArticle(article.id)
      }
    } catch {
      // rollback si erreur
      setLiked(liked)
      setLikeCount(article.likeCount)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
        width: '100%',
        height: '100%',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Zone cliquable vers le détail */}
      <CardContent
        component={Link}
        href={`/articles/${article.slug}`}
        sx={{
          p: 3,
          pb: '16px !important',
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* Auteur + date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Avatar sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: getAvatarColor(article.author) }}>
            {getInitials(article.author)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.primary" lineHeight={1.3}>
              {article.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(article.createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Titre */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontFamily: '"Georgia", serif',
            fontSize: '1.15rem',
            lineHeight: 1.4,
            color: 'text.primary',
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.title}
        </Typography>

        {/* Aperçu */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.65,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1,
          }}
        >
          {article.content}
        </Typography>
      </CardContent>

      {/* Footer */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Like + commentaire */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Bouton Like interactif */}
          <IconButton
            onClick={handleLike}
            disabled={loading}
            size="small"
            sx={{
              color: liked ? '#E8623A' : 'text.disabled',
              transition: 'transform 0.15s ease, color 0.15s ease',
              '&:hover': { color: '#E8623A', transform: 'scale(1.2)', bgcolor: 'rgba(232,98,58,0.08)' },
              '&:active': { transform: 'scale(0.9)' },
            }}
          >
            {liked ? <LikedIcon sx={{ fontSize: 18 }} /> : <LikeIcon sx={{ fontSize: 18 }} />}
          </IconButton>
          <Typography
            variant="caption"
            color={liked ? '#E8623A' : 'text.secondary'}
            fontWeight={liked ? 600 : 400}
            sx={{ mr: 1.5, minWidth: 16 }}
          >
            {likeCount}
          </Typography>

          {/* Icône commentaire → redirige vers #comments */}
          <IconButton
            component={Link}
            href={`/articles/${article.slug}#comments`}
            size="small"
            sx={{
              color: 'text.disabled',
              '&:hover': { color: '#1A7A5E', bgcolor: 'rgba(26,122,94,0.08)' },
            }}
          >
            <CommentIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {article.commentCount}
          </Typography>
        </Box>

        {/* Read more */}
        <Typography
          component={Link}
          href={`/articles/${article.slug}`}
          variant="body2"
          fontWeight={600}
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontSize: '0.85rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Read more →
        </Typography>
      </Box>
    </Card>
  )
}