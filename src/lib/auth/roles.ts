export const ROLES = {
  USER: 'USER',
  AUTHOR: 'AUTHOR',
  ADMIN: 'ADMIN',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/**
 * Extrait les rôles depuis le token Keycloak (realm_roles)
 * Le token décodé ressemble à : { realm_access: { roles: ['USER', 'AUTHOR', ...] } }
 */
// roles.ts
export function extractRoles(tokenParsed: Record<string, any> | undefined): Role[] {
  if (!tokenParsed) return []
  const realmRoles: string[] = tokenParsed?.realm_access?.roles ?? []
  const appRoles = Object.values(ROLES) as string[]
  
  // ✅ Comparaison insensible à la casse
  return realmRoles
    .map(r => r.toUpperCase())
    .filter(r => appRoles.includes(r)) as Role[]
}
/**
 * Retourne le rôle le plus élevé de l'utilisateur
 * Priorité : ADMIN > AUTHOR > USER
 */
export function getPrimaryRole(roles: Role[]): Role | null {
  if (roles.includes(ROLES.ADMIN)) return ROLES.ADMIN
  if (roles.includes(ROLES.AUTHOR)) return ROLES.AUTHOR
  if (roles.includes(ROLES.USER)) return ROLES.USER
  return null
}

export function hasRole(roles: Role[], role: Role): boolean {
  return roles.includes(role)
}

export function isAdmin(roles: Role[]): boolean {
  return hasRole(roles, ROLES.ADMIN)
}

export function isAuthor(roles: Role[]): boolean {
  return hasRole(roles, ROLES.AUTHOR) || hasRole(roles, ROLES.ADMIN)
}