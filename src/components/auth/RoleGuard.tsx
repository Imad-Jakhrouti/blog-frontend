'use client'

import { ReactNode } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/useAuth'
import { Role } from '@/lib/auth/roles'

interface RoleGuardProps {
  children: ReactNode
  /** Rôles autorisés à accéder à ce contenu */
  allowedRoles: Role[]
  /** Message personnalisé si accès refusé */
  fallback?: ReactNode
}

/**
 * Protège un bloc de contenu selon le rôle de l'utilisateur.
 *
 * Usage :
 * <RoleGuard allowedRoles={['AUTHOR', 'ADMIN']}>
 *   <CreateArticleButton />
 * </RoleGuard>
 */
export default function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user } = useAuth()

  const hasAccess = user && user.roles.some((role) => allowedRoles.includes(role))

  if (!hasAccess) {
    return (
      fallback ?? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            gap: 2,
            textAlign: 'center',
            p: 4,
          }}
        >
          <LockOutlined sx={{ fontSize: 56, color: 'text.disabled' }} />
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Accès restreint
          </Typography>
          <Typography color="text.secondary" maxWidth={400}>
            Vous n avez pas les droits nécessaires pour accéder à cette section.
          </Typography>
          <Button component={Link} href="/articles" variant="contained" sx={{ mt: 1 }}>
            Retour aux articles
          </Button>
        </Box>
      )
    )
  }

  return <>{children}</>
}