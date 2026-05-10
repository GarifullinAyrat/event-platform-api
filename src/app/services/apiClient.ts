import axios from 'axios'
import type { AuthResponse, LoginPayload, RegisterPayload } from '../entities/types'

export const api = axios.create({
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
