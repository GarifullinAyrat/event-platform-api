import axios from 'axios'

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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'X-App-Version': import.meta.env.VITE_APP_VERSION || '0.1.0'
  }
})

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', {
    ...payload,
    phone: payload.phone?.trim() || null
  })

  return response.data
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', payload)
  return response.data
}

export { api }
