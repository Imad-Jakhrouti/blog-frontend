'use client'

import { useState } from 'react'
import {
  Box, Container, Typography, Card, CardContent, Avatar,
  Skeleton, Alert, Pagination, IconButton, Chip
} from '@mui/material'
import {
  FavoriteBorder as LikeIcon, Favorite as LikedIcon,
  ChatBubbleOutline as CommentIcon, Search as SearchIcon
} from '@mui/icons-material'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import { ArticleResponse } from '@/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ArticleCard({ article }: { article: ArticleResponse }) {
  const initials = article.author?.username?.[0]?.toUpperCase() ?? '?'

  return (
    <Card elevation={0} sx={{
      border: '1px solid', borderColor: 'divider', borderRadius: 3,
      bgcolor: 'background.paper', transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Auteur */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#1A7A5E', fontSize: '0.85rem', fontWeight: 700 }}>
            {initials}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{article.author?.username}</Typography>
            <Typography variant="caption" color="text.disabled">{formatDate(article.createdAt)}</Typography>
          </Box>
        </Box>

        {/* Titre */}
        <Typography
          component={Link}
          href={`/articles/${article.slug}`}
          variant="h6"
          fontWeight={700}
          sx={{
            fontFamily: '"Georgia", serif', fontSize: '1.1rem', mb: 1,
            textDecoration: 'none', color: 'text.primary', display: 'block',
            '&:hover': { color: '#1A7A5E' }, transition: 'color 0.15s',
          }}
        >
          {article.title}
        </Typography>

        {/* Preview */}
        <Typography variant="body2" color="text.secondary" sx={{
          mb: 2.5, lineHeight: 1.7,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.content}
        </Typography>

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {article.likedByCurrentUser
                ? <LikedIcon sx={{ fontSize: 16, color: '#E53935' }} />
                : <LikeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />}
              <Typography variant="caption" color="text.secondary">{article.likeCount ?? 0}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">{article.commentCount ?? 0}</Typography>
            </Box>
          </Box>
          <Typography
            component={Link}
            href={`/articles/${article.slug}`}
            variant="caption"
            sx={{ color: '#1A7A5E', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Read more →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Skeleton variant="circular" width={36} height={36} />
          <Box><Skeleton width={100} height={16} /><Skeleton width={70} height={12} /></Box>
        </Box>
        <Skeleton width="70%" height={24} sx={{ mb: 1 }} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="60%" height={16} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={16} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default function ArticlesPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['articles', q, page],
    queryFn: () =>
      q
        ? api.get('/articles/search', {
            params: { keyword: q, page: page - 1, size: 9, sort: 'createdAt,desc' }
          }).then(r => r.data)
        : api.get('/articles', {
            params: { page: page - 1, size: 9, sort: 'createdAt,desc' }
          }).then(r => r.data),
  })

  const articles: ArticleResponse[] = data?.content ?? []
  const totalPages = data?.totalPages ?? 1
  const totalElements = data?.totalElements ?? 0

  return (
    <Box sx={{ bgcolor: '#F5F0EB', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 6 }}>

        {/* Header */}
        {q ? (
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <SearchIcon sx={{ color: '#1A7A5E', fontSize: 28 }} />
              <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Georgia", serif' }}>
                Résultats pour "{q}"
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {totalElements} résultat{totalElements > 1 ? 's' : ''} trouvé{totalElements > 1 ? 's' : ''}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Georgia", serif', mb: 0.5 }}>
              Latest Articles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {!isLoading && `${totalElements} article${totalElements > 1 ? 's' : ''} published`}
            </Typography>
          </Box>
        )}

        {/* Contenu */}
        {isError ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>Impossible de charger les articles.</Alert>
        ) : isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </Box>
        ) : articles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography fontSize={48} mb={2}>🔍</Typography>
            <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Georgia", serif' }}>
              Aucun article trouvé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Essayez avec d'autres mots-clés
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {articles.map(article => <ArticleCard key={article.id} article={article} />)}
          </Box>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Pagination
              count={totalPages} page={page}
              onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              color="primary"
              sx={{ '& .Mui-selected': { bgcolor: '#1A7A5E !important' } }}
            />
          </Box>
        )}

      </Container>
    </Box>
  )
}