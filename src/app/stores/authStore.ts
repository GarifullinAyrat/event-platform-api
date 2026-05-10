import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthUser, LoginPayload, RegisterPayload } from '../entities/types'
import { login, register } from '../services/apiClient'

const AUTH_TOKEN_KEY = 'event-platform.authToken'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(localStorage.getItem(AUTH_TOKEN_KEY))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  async function registerUser(payload: RegisterPayload) {
    loading.value = true
    error.value = null

    try {
      const response = await register(payload)
      user.value = response.user
      token.value = response.token
      localStorage.setItem(AUTH_TOKEN_KEY, response.token)
      return response
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Registration failed'
      throw cause
    } finally {
      loading.value = false
    }
  }

  async function loginUser(payload: LoginPayload) {
    loading.value = true
    error.value = null

    try {
      const response = await login(payload)
      user.value = response.user
      token.value = response.token
      localStorage.setItem(AUTH_TOKEN_KEY, response.token)
      return response
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Login failed'
      throw cause
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    registerUser,
    loginUser,
    logout
  }
})
