export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  bio?: string
  avatarUrl?: string
}

export interface UserResponse {
  id: number
  keycloakId: string
  username: string
  email: string
  firstName: string
  lastName: string
  bio: string
  avatarUrl: string
  role: 'USER' | 'ADMIN' | 'AUTHOR'
}