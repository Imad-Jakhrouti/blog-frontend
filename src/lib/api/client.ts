import axios from 'axios'
import keycloak from '@/lib/auth/keycloak'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Injecte le token avant chaque requête
// Si le token est expiré, Keycloak le rafraîchit automatiquement
api.interceptors.request.use(async (config) => {
  if (!keycloak.authenticated) return config

  try {
    // Rafraîchit le token s'il expire dans moins de 30 secondes
    await keycloak.updateToken(30)
  } catch {
    // Token non rafraîchissable → redirection login
    keycloak.login()
    return Promise.reject(new Error('Session expirée, reconnexion en cours...'))
  }

  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`
  }

  return config
})

// Intercepteur de réponse pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      keycloak.login()
    }
    return Promise.reject(error)
  }
)