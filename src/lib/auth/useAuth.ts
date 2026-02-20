'use client'

import { useMemo } from 'react'
import keycloak from '@/lib/auth/keycloak'
import { extractRoles, getPrimaryRole, isAdmin, isAuthor, Role } from './roles'

export interface AuthUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  roles: Role[]
  primaryRole: Role | null
  isAdmin: boolean
  isAuthor: boolean
  token: string | undefined
}

export function useAuth(): { user: AuthUser | null; logout: () => void } {
  const user = useMemo<AuthUser | null>(() => {
    if (!keycloak.authenticated || !keycloak.tokenParsed) return null

    const tp = keycloak.tokenParsed as Record<string, any>
    const roles = extractRoles(tp)

    return {
      id: tp.sub ?? '',
      username: tp.preferred_username ?? '',
      email: tp.email ?? '',
      firstName: tp.given_name ?? '',
      lastName: tp.family_name ?? '',
      fullName: `${tp.given_name ?? ''} ${tp.family_name ?? ''}`.trim(),
      roles,
      primaryRole: getPrimaryRole(roles),
      isAdmin: isAdmin(roles),
      isAuthor: isAuthor(roles),
      token: keycloak.token,
    }
  }, [keycloak.authenticated, keycloak.token])

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin })
  }

  return { user, logout }
}