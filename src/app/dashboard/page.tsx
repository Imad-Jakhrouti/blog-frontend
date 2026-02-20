'use client'

import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { Article as ArticleIcon, Add as AddIcon } from '@mui/icons-material'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/useAuth'
import RoleGuard from '@/components/auth/RoleGuard'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <RoleGuard allowedRoles={['AUTHOR', 'ADMIN']}>
      <Box sx={{ bgcolor: '#F5F0EB', minHeight: '100vh' }}>
        <Container maxWidth="md" sx={{ py: 6 }}>

          <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Georgia", serif', mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
            Bonjour {user?.firstName || user?.username}, que souhaitez-vous faire ?
          </Typography>

          <Grid container spacing={3}>

            <Grid item xs={12} sm={6}>
              <Card elevation={0} sx={{
                border: '1px solid', borderColor: 'divider', borderRadius: 3,
                '&:hover': { boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }, transition: 'box-shadow 0.2s'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <ArticleIcon sx={{ color: '#1A7A5E', fontSize: 32, mb: 1.5 }} />
                  <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Georgia", serif', mb: 1 }}>
                    Mes articles
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    Gérez, modifiez ou supprimez vos articles publiés.
                  </Typography>
                  <Button
                    component={Link} href="/dashboard/articles"
                    variant="contained"
                    sx={{ bgcolor: '#1A7A5E', '&:hover': { bgcolor: '#156B51' }, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Voir mes articles
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card elevation={0} sx={{
                border: '1px solid', borderColor: 'divider', borderRadius: 3,
                '&:hover': { boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }, transition: 'box-shadow 0.2s'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <AddIcon sx={{ color: '#1A7A5E', fontSize: 32, mb: 1.5 }} />
                  <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Georgia", serif', mb: 1 }}>
                    Nouvel article
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    Rédigez et publiez un nouvel article pour la communauté.
                  </Typography>
                  <Button
                    component={Link} href="/dashboard/articles/new"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ borderColor: '#1A7A5E', color: '#1A7A5E', '&:hover': { bgcolor: 'rgba(26,122,94,0.06)' }, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Créer un article
                  </Button>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </RoleGuard>
  )
}