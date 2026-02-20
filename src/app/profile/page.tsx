'use client'

import { useEffect, useState } from 'react'
import {
  Box, Container, Typography, TextField, Button, Alert,
  CircularProgress, Avatar, Skeleton, Divider, Chip
} from '@mui/material'
import {
  Save as SaveIcon, Email as EmailIcon, Article as ArticleIcon,
  Edit as EditIcon, Person as PersonIcon, Badge as BadgeIcon
} from '@mui/icons-material'
import { useAuth } from '@/lib/auth/useAuth'
import { api } from '@/lib/api/client'
import { UserResponse, UpdateProfileRequest } from '@/types'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#FAFAFA',
    borderRadius: 2,
    '& fieldset': { borderColor: '#E8E8E8' },
    '&:hover fieldset': { borderColor: '#1A7A5E' },
    '&.Mui-focused fieldset': { borderColor: '#1A7A5E' },
  },
  '& label.Mui-focused': { color: '#1A7A5E' },
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    api.get<UserResponse>('/users/me')
      .then(({ data }) => {
        setProfile(data)
        setFirstName(data.firstName ?? '')
        setLastName(data.lastName ?? '')
        setBio(data.bio ?? '')
      })
      .catch(() => setError('Impossible de charger le profil'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const { data } = await api.put<UserResponse>('/users/me', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
      } as UpdateProfileRequest)
      setProfile(data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Erreur lors de la sauvegarde. Réessayez.')
    } finally {
      setSaving(false)
    }
  }

  const initials = profile
    ? `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase() || profile.username?.[0]?.toUpperCase()
    : '?'

  const roleColor: Record<string, string> = {
    ADMIN: '#DC2626',
    AUTHOR: '#1A7A5E',
    USER: '#6B7280',
  }

  return (
    <Box sx={{ bgcolor: '#F5F0EB', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>

          {/* ── Colonne gauche — carte profil ── */}
          <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>

            {/* Card identité */}
            <Box sx={{
              bgcolor: 'white', borderRadius: 4, overflow: 'hidden',
              border: '1px solid', borderColor: 'divider',
              boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
            }}>
              {/* Banner gradient */}
              <Box sx={{
                height: 90,
                background: 'linear-gradient(135deg, #1A7A5E 0%, #2EA87A 50%, #B2DFDB 100%)',
                position: 'relative',
              }} />

              <Box sx={{ px: 3, pb: 3, mt: -5 }}>
                {loading ? (
                  <Skeleton variant="circular" width={80} height={80} sx={{ border: '4px solid white' }} />
                ) : (
                  <Avatar sx={{
                    width: 80, height: 80,
                    bgcolor: '#C4956A',
                    fontSize: '1.6rem', fontWeight: 700,
                    border: '4px solid white',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                  }}>
                    {initials}
                  </Avatar>
                )}

                <Box sx={{ mt: 2 }}>
                  {loading ? (
                    <>
                      <Skeleton width={140} height={26} sx={{ mb: 0.5 }} />
                      <Skeleton width={90} height={18} sx={{ mb: 2 }} />
                      <Skeleton width="100%" height={14} />
                      <Skeleton width="80%" height={14} />
                    </>
                  ) : profile ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Georgia", serif' }}>
                          {profile.firstName} {profile.lastName}
                        </Typography>
                        {profile.role && (
                          <Chip
                            label={profile.role}
                            size="small"
                            sx={{
                              height: 20, fontSize: '0.65rem', fontWeight: 700,
                              bgcolor: `${roleColor[profile.role]}15`,
                              color: roleColor[profile.role],
                              border: `1px solid ${roleColor[profile.role]}30`,
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
                        @{profile.username}
                      </Typography>

                      {profile.bio && (
                        <Typography variant="body2" color="text.secondary"
                          sx={{ mb: 2.5, lineHeight: 1.7, fontStyle: 'italic' }}>
                          {profile.bio}
                        </Typography>
                      )}

                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 15, color: '#1A7A5E' }} />
                          <Typography variant="caption" color="text.secondary">{profile.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ArticleIcon sx={{ fontSize: 15, color: '#1A7A5E' }} />
                          <Typography variant="caption" color="text.secondary">
                            {profile.articleCount ?? 0} article{(profile.articleCount ?? 0) > 1 ? 's' : ''} publié{(profile.articleCount ?? 0) > 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── Colonne droite — formulaire ── */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{
              bgcolor: 'white', borderRadius: 4,
              border: '1px solid', borderColor: 'divider',
              boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}>
              {/* Header formulaire */}
              <Box sx={{
                px: 4, py: 2.5, borderBottom: '1px solid',
                borderColor: 'divider', bgcolor: '#FAFAFA',
                display: 'flex', alignItems: 'center', gap: 1.5,
              }}>
                <EditIcon sx={{ fontSize: 18, color: '#1A7A5E' }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  Modifier le profil
                </Typography>
              </Box>

              <Box sx={{ p: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                {success && (
                  <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    ✅ Profil mis à jour avec succès !
                  </Alert>
                )}

                {loading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Skeleton height={56} sx={{ flex: 1, borderRadius: 2 }} />
                      <Skeleton height={56} sx={{ flex: 1, borderRadius: 2 }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Skeleton height={56} sx={{ flex: 1, borderRadius: 2 }} />
                      <Skeleton height={56} sx={{ flex: 1, borderRadius: 2 }} />
                    </Box>
                    <Skeleton height={100} sx={{ borderRadius: 2 }} />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Section identité */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <PersonIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" fontWeight={700} color="text.disabled"
                          sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                          Identité
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Prénom" fullWidth size="small"
                          value={firstName} onChange={(e) => setFirstName(e.target.value)}
                          sx={inputSx} />
                        <TextField label="Nom" fullWidth size="small"
                          value={lastName} onChange={(e) => setLastName(e.target.value)}
                          sx={inputSx} />
                      </Box>
                    </Box>

                    {/* Section compte */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <BadgeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" fontWeight={700} color="text.disabled"
                          sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                          Compte
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Nom d'utilisateur" fullWidth size="small"
                          value={profile?.username ?? ''} disabled sx={inputSx} />
                        <TextField label="Email" fullWidth size="small"
                          value={profile?.email ?? ''} disabled sx={inputSx} />
                      </Box>
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                        Ces informations sont gérées par Keycloak et ne peuvent pas être modifiées ici.
                      </Typography>
                    </Box>

                    {/* Bio */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <EditIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" fontWeight={700} color="text.disabled"
                          sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                          Bio
                        </Typography>
                      </Box>
                      <TextField fullWidth multiline minRows={3}
                        placeholder="Parlez de vous en quelques mots..."
                        value={bio} onChange={(e) => setBio(e.target.value)}
                        sx={inputSx} />
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                        {bio.length}/300 caractères
                      </Typography>
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="contained" onClick={handleSave} disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                        sx={{
                          bgcolor: '#1A7A5E', '&:hover': { bgcolor: '#156B51' },
                          borderRadius: 2.5, fontWeight: 600, textTransform: 'none', px: 4,
                          boxShadow: '0 4px 12px rgba(26,122,94,0.3)',
                        }}>
                        {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                      </Button>
                    </Box>

                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}