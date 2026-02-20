'use client'

import { useState } from 'react'
import { Box, Container, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material'
import { ArrowBack as BackIcon, Send as SendIcon } from '@mui/icons-material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCreateArticle } from '@/features/articles/hooks/useMyArticles'
import RoleGuard from '@/components/auth/RoleGuard'

export default function NewArticlePage() {
  const router = useRouter()
  const createArticle = useCreateArticle()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!title.trim()) return setError('Le titre est requis')
    if (!content.trim()) return setError('Le contenu est requis')
    setError('')
    createArticle.mutate(
      { title: title.trim(), content: content.trim() },
      {
        onSuccess: () => router.push('/dashboard/articles'),
        onError: () => setError('Erreur lors de la création. Réessayez.'),
      }
    )
  }

  return (
    <RoleGuard allowedRoles={['AUTHOR', 'ADMIN']}>
      <Box sx={{ bgcolor: '#F5F0EB', minHeight: '100vh' }}>
        <Container maxWidth="sm" sx={{ py: 6 }}>

          <Button component={Link} href="/dashboard" startIcon={<BackIcon />}
            sx={{ color: 'text.secondary', textTransform: 'none', mb: 4, px: 0, '&:hover': { color: '#1A7A5E', bgcolor: 'transparent' } }}>
            Retour au dashboard
          </Button>

          <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Georgia", serif', mb: 1 }}>
            Nouvel article
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Rédigez et publiez votre article
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField label="Titre" fullWidth value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Un titre accrocheur..."
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#1A7A5E' } }, '& label.Mui-focused': { color: '#1A7A5E' } }} />
            <TextField label="Contenu" fullWidth multiline minRows={12} value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Rédigez votre article ici..."
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#1A7A5E' } }, '& label.Mui-focused': { color: '#1A7A5E' } }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button component={Link} href="/dashboard" variant="outlined"
                sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}>
                Annuler
              </Button>
              <Button variant="contained" onClick={handleSubmit} disabled={createArticle.isPending}
                endIcon={createArticle.isPending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                sx={{ bgcolor: '#1A7A5E', '&:hover': { bgcolor: '#156B51' }, borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3 }}>
                Publier
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </RoleGuard>
  )
}