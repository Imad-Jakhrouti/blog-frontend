'use client'

import { use, useEffect, useState } from 'react'
import { Box, Container, Typography, TextField, Button, Alert, CircularProgress, Skeleton } from '@mui/material'
import { ArrowBack as BackIcon, Save as SaveIcon } from '@mui/icons-material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUpdateArticle } from '@/features/articles/hooks/useMyArticles'
import { api } from '@/lib/api/client'
import { ArticleDetailsResponse } from '@/types'
import RoleGuard from '@/components/auth/RoleGuard'

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const updateArticle = useUpdateArticle()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // 1. D'abord on récupère la liste de mes articles pour trouver le slug via l'id
    api.get<{ content: { id: number; slug: string; title: string }[] }>(`/articles/me?size=100`)
      .then(({ data }) => {
        const found = data.content.find(a => a.id === Number(id))
        if (!found) throw new Error('Article introuvable')
        setSlug(found.slug)
        // 2. Ensuite on charge les détails via le slug
        return api.get<ArticleDetailsResponse>(`/articles/${found.slug}`)
      })
      .then(({ data }) => {
        setTitle(data.title)
        setContent(data.content)
      })
      .catch(() => setError('Article introuvable'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = () => {
    if (!title.trim()) return setError('Le titre est requis')
    if (!content.trim()) return setError('Le contenu est requis')
    setError('')
    updateArticle.mutate(
      { id: Number(id), body: { title: title.trim(), content: content.trim() } },
      {
        onSuccess: () => router.push('/dashboard/articles'),
        onError: () => setError('Erreur lors de la modification. Réessayez.'),
      }
    )
  }

  return (
    <RoleGuard allowedRoles={['AUTHOR', 'ADMIN']}>
      <Box sx={{ bgcolor: '#F5F0EB', minHeight: '100vh' }}>
        <Container maxWidth="sm" sx={{ py: 6 }}>

          <Button component={Link} href="/dashboard/articles" startIcon={<BackIcon />}
            sx={{ color: 'text.secondary', textTransform: 'none', mb: 4, px: 0,
              '&:hover': { color: '#1A7A5E', bgcolor: 'transparent' } }}>
            Retour au dashboard
          </Button>

          <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Georgia", serif', mb: 1 }}>
            Modifier l'article
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Mettez à jour le contenu de votre article
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Skeleton height={56} sx={{ borderRadius: 2 }} />
              <Skeleton height={300} sx={{ borderRadius: 2 }} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField label="Titre" fullWidth value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 2,
                  '&.Mui-focused fieldset': { borderColor: '#1A7A5E' } },
                  '& label.Mui-focused': { color: '#1A7A5E' } }} />
              <TextField label="Contenu" fullWidth multiline minRows={12} value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 2,
                  '&.Mui-focused fieldset': { borderColor: '#1A7A5E' } },
                  '& label.Mui-focused': { color: '#1A7A5E' } }} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button component={Link} href="/dashboard/articles" variant="outlined"
                  sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}>
                  Annuler
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={updateArticle.isPending}
                  endIcon={updateArticle.isPending
                    ? <CircularProgress size={16} color="inherit" />
                    : <SaveIcon />}
                  sx={{ bgcolor: '#1A7A5E', '&:hover': { bgcolor: '#156B51' },
                    borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3 }}>
                  Enregistrer
                </Button>
              </Box>
            </Box>
          )}

        </Container>
      </Box>
    </RoleGuard>
  )
}