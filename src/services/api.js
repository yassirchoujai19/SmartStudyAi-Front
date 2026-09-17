import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8001/api',
  headers: { Accept: 'application/json' },
})

// Le jeton Sanctum est stocké côté navigateur et rejoué sur chaque requête.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartstudy_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Une session expirée renvoie l'utilisateur vers la page de connexion.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
      localStorage.removeItem('smartstudy_token')
      localStorage.removeItem('smartstudy_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Traduit une erreur Axios en message lisible par l'étudiant.
 * Les détails techniques ne sont jamais affichés tels quels.
 */
export function humanError(error, fallback = 'Une erreur est survenue. Veuillez réessayer.') {
  const status = error?.response?.status

  if (error?.code === 'ERR_NETWORK') {
    return "Impossible de joindre le serveur. Vérifiez que l'API Laravel est démarrée."
  }

  if (status === 422) {
    const errors = error.response?.data?.errors
    const first = errors && Object.values(errors)[0]
    return Array.isArray(first) ? first[0] : 'Certains champs sont invalides.'
  }

  if (status === 401) return 'Session expirée. Veuillez vous reconnecter.'
  if (status === 403) return "Vous n'avez pas accès à cette ressource."
  if (status === 404) return 'Ressource introuvable.'
  if (status >= 500) return 'Le serveur est momentanément indisponible. Veuillez réessayer.'

  return fallback
}

export default api
