'use client'

import { useState } from 'react'
import {
  Box, Container, Typography, Button, Card, CardContent,
  Skeleton, Alert, Pagination, IconButton
} from '@mui/material'
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as ViewIcon, ChatBubbleOutline as CommentIcon,
  FavoriteBorder as LikeIcon, Article as ArticleIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useMyArticles, useDeleteMyArticle } from '@/features/articles/hooks/useMyArticles'
import { useAuth } from '@/lib/auth/useAuth'
import { MyArticleResponse } from '@/types'
import RoleGuard from '@/components/auth/RoleGuard'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ArticleRow({ article, onDelete }: { article: MyArticleResponse; onDelete: (id: number) => void }) {
  return (
    <Card elevation={0} sx={{
      border: '1px solid', borderColor: 'divider', borderRadius: 3,
      bgcolor: 'background.paper', transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
    }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} sx={{
              fontFamily: '"Georgia", serif', fontSize: '1.05rem', mb: 0.75,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {article.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{
              mb: 2, display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6,
            }}>
              {article.contentPreview}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.disabled">{formatDate(article.createdAt)}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LikeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">{article.likeCount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">{article.commentCount}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            <IconButton component={Link} href={`/articles/${article.slug}`} size="small"
              sx={{ color: 'text.disabled', '&:hover': { color: '#1A7A5E', bgcolor: 'rgba(26,122,94,0.08)' } }}>
              <ViewIcon fontSize="small" />
            </IconButton>
            <IconButton component={Link} href={`/dashboard/articles/${article.id}/edit`} size="small"
              sx={{ color: 'text.disabled', '&:hover': { color: '#1A7A5E', bgcolor: 'rgba(26,122,94,0.08)' } }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small"
              onClick={() => { if (confirm('Supprimer cet article définitivement ?')) onDelete(article.id) }}
              sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: 'rgba(220,38,38,0.06)' } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

function SkeletonRow() {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Skeleton width="50%" height={22} sx={{ mb: 1 }} />
        <Skeleton width="100%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton width="75%" height={16} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton width={80} height={14} />
          <Skeleton width={40} height={14} />
          <Skeleton width={40} height={14} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default function DashboardArticlesPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useMyArticles({ page: page - 1, size: 8 })
  const deleteArticle = useDeleteMyArticle()

  const articles = data?.content ?? []
  const totalPages = data?.totalPages ?? 1
  const totalElements = data?.totalElements ?? 0

  return (
    <RoleGuard allowedRoles={['AUTHOR', 'ADMIN']}>
      <Box sx={{ bgcolor: '#F5F0EB', minHeight: '100vh' }}>
        <Container maxWidth="md" sx={{ py: 6 }}>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <ArticleIcon sx={{ color: '#1A7A5E', fontSize: 28 }} />
                <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Georgia", serif' }}>
                  Mes articles
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Bonjour {user?.firstName || user?.username} —{' '}
                {!isLoading && `${totalElements} article${totalElements > 1 ? 's' : ''} publié${totalElements > 1 ? 's' : ''}`}
              </Typography>
            </Box>
            <Button component={Link} href="/dashboard/articles/new" variant="contained"
              startIcon={<AddIcon />}
              sx={{ bgcolor: '#1A7A5E', '&:hover': { bgcolor: '#156B51' }, borderRadius: 2.5, fontWeight: 600, textTransform: 'none', px: 3 }}>
              Nouvel article
            </Button>
          </Box>

          {isError ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>Impossible de charger vos articles.</Alert>
          ) : isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            </Box>
          ) : articles.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 12 }}>
              <Typography fontSize={48} mb={2}>✍️</Typography>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Georgia", serif' }}>
                Vous n'avez pas encore d'articles
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Commencez par rédiger votre premier article !
              </Typography>
              <Button component={Link} href="/dashboard/articles/new" variant="contained"
                startIcon={<AddIcon />}
                sx={{ bgcolor: '#1A7A5E', '&:hover': { bgcolor: '#156B51' }, borderRadius: 2.5, textTransform: 'none', fontWeight: 600 }}>
                Créer mon premier article
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {articles.map((article) => (
                <ArticleRow key={article.id} article={article} onDelete={(id) => deleteArticle.mutate(id)} />
              ))}
            </Box>
          )}

          {!isLoading && !isError && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination count={totalPages} page={page}
                onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                color="primary"
                sx={{ '& .Mui-selected': { bgcolor: '#1A7A5E !important' } }} />
            </Box>
          )}

        </Container>
      </Box>
    </RoleGuard>
  )
}