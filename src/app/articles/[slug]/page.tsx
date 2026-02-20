'use client'

import { use } from 'react'
import { Box, Container, Typography, Avatar, Skeleton, Alert, Button, Divider } from '@mui/material'
import { ArrowBack as BackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useArticleDetail } from '@/features/articles/hooks/useArticleDetail'
import { useAuth } from '@/lib/auth/useAuth'
import LikeButton from '@/features/articles/components/LikeButton'
import CommentSection from '@/features/articles/components/CommentSection'
import { deleteArticle } from '@/features/articles/api/articleApi'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}
const AVATAR_COLORS = ['#6B9E78', '#C4956A', '#7B8EC8', '#C47A7A', '#8EC4C4']
function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: article, isLoading, isError } = useArticleDetail(slug)
  const { user } = useAuth()
  const router = useRouter()

  // Modifier/Supprimer l'article : AUTHOR propriétaire OU ADMIN seulement
  const canEditArticle = user && article && (user.username === article.author || user.isAdmin)

  const handleDeleteArticle = async () => {
    if (!article || !confirm('Supprimer cet article définitivement ?')) return
    await deleteArticle(article.id)
    router.push('/articles')
  }

  // ── Loading ──
  if (isLoading) {
    return (
      <Box sx={{ bgcolor: '#F5F0EB', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="sm">
          <Skeleton width={120} height={36} sx={{ mb: 4 }} />
          <Skeleton width="70%" height={52} sx={{ mb: 1 }} />
          <Skeleton width="50%" height={52} sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box><Skeleton width={100} height={16} /><Skeleton width={80} height={14} /></Box>
          </Box>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} width={i % 4 === 3 ? '65%' : '100%'} height={18} sx={{ mb: 0.75 }} />
          ))}
        </Container>
      </Box>
    )
  }

  // ── Erreur ──
  if (isError || !article) {
    return (
      <Box sx={{ bgcolor: '#F5F0EB', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="sm">
          <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>Article introuvable.</Alert>
          <Button component={Link} href="/articles" startIcon={<BackIcon />}>Retour aux articles</Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#F5F0EB', minHeight: '100vh' }}>
      <Container maxWidth="sm" sx={{ py: 6 }}>

        {/* Retour */}
        <Button
          component={Link} href="/articles" startIcon={<BackIcon />}
          sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500, mb: 4, px: 0, '&:hover': { color: '#1A7A5E', bgcolor: 'transparent' } }}
        >
          Retour aux articles
        </Button>

        {/* Titre */}
        <Typography
          variant="h3" fontWeight={700}
          sx={{ fontFamily: '"Georgia", serif', fontSize: { xs: '1.8rem', md: '2.4rem' }, lineHeight: 1.25, color: '#1A1A1A', mb: 3 }}
        >
          {article.title}
        </Typography>

        {/* Auteur + date + actions article (AUTHOR / ADMIN) */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, fontSize: '0.85rem', fontWeight: 700, bgcolor: getAvatarColor(article.author) }}>
              {getInitials(article.author)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} color="text.primary">{article.author}</Typography>
              <Typography variant="caption" color="text.secondary">{formatDate(article.createdAt)}</Typography>
            </Box>
          </Box>

          {/* Boutons modifier/supprimer — AUTHOR propriétaire ou ADMIN uniquement */}
          {canEditArticle && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link} href={`/dashboard/articles/${article.id}/edit`}
                startIcon={<EditIcon />} size="small" variant="outlined"
                sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary', borderRadius: 2, '&:hover': { borderColor: '#1A7A5E', color: '#1A7A5E' } }}
              >
                Modifier
              </Button>
              <Button
                onClick={handleDeleteArticle}
                startIcon={<DeleteIcon />} size="small" variant="outlined" color="error"
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Supprimer
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', mb: 4 }} />

        {/* Contenu */}
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.85, fontSize: '1.05rem', color: '#2D2D2D', whiteSpace: 'pre-wrap', mb: 5 }}
        >
          {article.content}
        </Typography>

        <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', mb: 3 }} />

        {/* Like */}
        <Box sx={{ mb: 5 }}>
          <LikeButton article={article} slug={slug} />
        </Box>

        <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', mb: 4 }} />

        {/* Commentaires — utilisateurs peuvent ajouter/modifier leurs propres commentaires, admins peuvent supprimer tous */}
        <CommentSection slug={slug} comments={article.comments} />

      </Container>
    </Box>
  )
}