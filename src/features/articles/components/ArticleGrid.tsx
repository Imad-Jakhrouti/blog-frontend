'use client'

import { Grid, Skeleton, Card, CardContent, Box, Typography, Button, Alert } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import ArticleCard from './ArticleCard'
import { ArticleResponse } from '@/types'

function ArticleCardSkeleton() {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, pb: '12px !important' }}>
        {/* Avatar + auteur */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Skeleton variant="circular" width={36} height={36} />
          <Box>
            <Skeleton width={120} height={14} />
            <Skeleton width={160} height={12} />
          </Box>
        </Box>
        {/* Titre */}
        <Skeleton width="85%" height={22} sx={{ mb: 0.5 }} />
        <Skeleton width="60%" height={22} sx={{ mb: 2 }} />
        {/* Contenu */}
        <Skeleton width="100%" height={14} sx={{ mb: 0.5 }} />
        <Skeleton width="100%" height={14} sx={{ mb: 0.5 }} />
        <Skeleton width="75%" height={14} sx={{ mb: 2 }} />
      </CardContent>
      <Box sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width={80} height={20} />
        <Skeleton width={80} height={20} />
      </Box>
    </Card>
  )
}

function EmptyState() {
  return (
    <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 10 }}>
      <Typography fontSize={48} mb={2}>📭</Typography>
      <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
        Aucun article pour le moment
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Revenez bientôt, du contenu arrive !
      </Typography>
    </Box>
  )
}

interface ArticleGridProps {
  articles: ArticleResponse[]
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
  skeletonCount?: number
}

export default function ArticleGrid({
  articles,
  isLoading,
  isError,
  onRetry,
  skeletonCount = 6,
}: ArticleGridProps) {
  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
              Réessayer
            </Button>
          )
        }
        sx={{ borderRadius: 2 }}
      >
        Impossible de charger les articles.
      </Alert>
    )
  }

  return (
    <Grid container spacing={3} alignItems="stretch">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <Grid item xs={12} sm={6} key={i} sx={{ display: 'flex' }}>
              <ArticleCardSkeleton />
            </Grid>
          ))
        : articles.length === 0
        ? <EmptyState />
        : articles.map((article) => (
            <Grid item xs={12} sm={6} key={article.id} sx={{ display: 'flex' }}>
              <ArticleCard article={article} />
            </Grid>
          ))}
    </Grid>  )
}