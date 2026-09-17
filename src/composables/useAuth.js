import { computed, ref } from 'vue'
import api, { humanError } from '@/services/api'

const TOKEN_KEY = 'smartstudy_token'
const USER_KEY = 'smartstudy_user'

// État partagé par toute l'application (module singleton).
const token = ref(localStorage.getItem(TOKEN_KEY))
const user = ref(JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'))

function persist(nextToken, nextUser) {
  token.value = nextToken
  user.value = nextUser
  localStorage.setItem(TOKEN_KEY, nextToken)
  localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
}

function clear() {
  token.value = null
  user.value = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function useAuth() {
  const loading = ref(false)
  const error = ref('')

  async function login(credentials) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.post('/login', credentials)
      persist(data.token, data.user)
      return true
    } catch (e) {
      error.value = humanError(e, 'Connexion impossible. Vérifiez vos identifiants.')
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.post('/register', payload)
      persist(data.token, data.user)
      return true
    } catch (e) {
      error.value = humanError(e, "Inscription impossible. Veuillez réessayer.")
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      // La déconnexion locale reste valable même si l'API est injoignable.
    } finally {
      clear()
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: computed(() => Boolean(token.value)),
    login,
    register,
    logout,
  }
}

export function isAuthenticated() {
  return Boolean(token.value)
}
