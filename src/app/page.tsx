'use client'

import { Box, Button, Container, Typography, Grid, Divider } from '@mui/material'
import {
  AutoStories as ReadIcon,
  Edit as WriteIcon,
  Group as CommunityIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { useEffect } from 'react'
import keycloak from '@/lib/auth/keycloak'

const features = [
  {
    icon: <ReadIcon sx={{ fontSize: 28, color: '#1A7A5E' }} />,
    title: 'Lisez & explorez',
    description: 'Accédez à des articles rédigés par des auteurs passionnés sur des sujets variés.',
  },
  {
    icon: <WriteIcon sx={{ fontSize: 28, color: '#1A7A5E' }} />,
    title: 'Écrivez & publiez',
    description: 'Partagez vos idées avec la communauté. Créez, éditez et gérez vos articles facilement.',
  },
  {
    icon: <CommunityIcon sx={{ fontSize: 28, color: '#1A7A5E' }} />,
    title: 'Interagissez',
    description: 'Likez les articles qui vous inspirent, laissez des commentaires et engagez la conversation.',
  },
]

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Si déjà connecté → redirection automatique
  useEffect(() => {
    if (user) {
      router.replace('/articles')
    }
  }, [user])

  const handleLogin = () => {
    keycloak.login({ redirectUri: `${window.location.origin}/articles` })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F0EB', display: 'flex', flexDirection: 'column' }}>

      {/* ── HERO ── */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pt: { xs: 10, md: 14 }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>

            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 10,
                border: '1px solid rgba(26, 122, 94, 0.3)',
                bgcolor: 'rgba(26, 122, 94, 0.06)',
                mb: 4,
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#1A7A5E' }} />
              <Typography
                variant="caption"
                fontWeight={600}
                color="#1A7A5E"
                sx={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: 0.5 }}
              >
                Plateforme de blog
              </Typography>
            </Box>

            {/* Titre */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: '"Georgia", serif',
                fontSize: { xs: '2.6rem', md: '4rem' },
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#1A1A1A',
                mb: 3,
                letterSpacing: '-1px',
              }}
            >
              Des idées qui méritent{' '}
              <Box
                component="span"
                sx={{
                  color: '#1A7A5E',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 2,
                    left: 0,
                    right: 0,
                    height: 3,
                    bgcolor: 'rgba(26, 122, 94, 0.25)',
                    borderRadius: 1,
                  },
                }}
              >
                d'être lues
              </Box>
            </Typography>

            {/* Sous-titre */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.7, maxWidth: 520, mx: 'auto', mb: 5 }}
            >
              Rejoignez une communauté d'auteurs et de lecteurs passionnés.
              Lisez, écrivez et échangez sur des sujets qui vous inspirent.
            </Typography>

            {/* Bouton Se connecter */}
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              onClick={handleLogin}
              sx={{
                bgcolor: '#1A7A5E',
                color: '#fff',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2.5,
                boxShadow: '0 4px 20px rgba(26, 122, 94, 0.3)',
                '&:hover': {
                  bgcolor: '#156B51',
                  boxShadow: '0 6px 28px rgba(26, 122, 94, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Se connecter
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── DIVIDER ── */}
      <Container maxWidth="md">
        <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />
      </Container>

      {/* ── FEATURES ── */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <Grid container spacing={4} justifyContent="center">
            {features.map((f, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'rgba(26, 122, 94, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2.5,
                    }}
                  >
                    {f.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ fontFamily: '"Georgia", serif', mb: 1, color: '#1A1A1A' }}
                  >
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {f.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ py: 3, textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <Typography variant="caption" color="text.disabled">
          © {new Date().getFullYear()} BlogApp — Tous droits réservés
        </Typography>
      </Box>
    </Box>
  )
}