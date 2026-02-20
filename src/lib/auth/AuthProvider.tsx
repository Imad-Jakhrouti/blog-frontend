'use client'

import { ReactNode, useEffect, useState } from 'react'
import keycloak from './keycloak'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    keycloak
      .init({
        // check-sso : vérifie si l'utilisateur est déjà connecté
        // mais ne force PAS la redirection vers Keycloak
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri:
          typeof window !== 'undefined'
            ? `${window.location.origin}/silent-check-sso.html`
            : undefined,
      })
      .then(() => {
        setInitialized(true)
      })
      .catch(() => {
        setInitialized(true) // on laisse passer même en cas d'erreur
      })
  }, [])

  if (!initialized) return null // pas de "Loading..." bloquant

  return <>{children}</>
}