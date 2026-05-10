export interface RegisterPayload {
  email: string
  password: string
  name: string
  phone?: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  phone: string | null
  created_at: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}
