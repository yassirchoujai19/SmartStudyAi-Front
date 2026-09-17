import { ref } from 'vue'
import api, { humanError } from '@/services/api'

export function useNotes() {
  const notes = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/notes')
      notes.value = data.data
    } catch (e) {
      error.value = humanError(e, 'Impossible de charger les notes. Veuillez réessayer.')
    } finally {
      loading.value = false
    }
  }

  async function create(subjectId, payload) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await api.post(`/subjects/${subjectId}/notes`, payload)
      notes.value = [data.data, ...notes.value]
      return data.data
    } catch (e) {
      error.value = humanError(e, 'Impossible de créer la note. Veuillez réessayer.')
      return null
    } finally {
      saving.value = false
    }
  }

  async function update(id, payload) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await api.put(`/notes/${id}`, payload)
      notes.value = notes.value.map((n) => (n.id === id ? data.data : n))
      return data.data
    } catch (e) {
      error.value = humanError(e, 'Impossible de modifier la note. Veuillez réessayer.')
      return null
    } finally {
      saving.value = false
    }
  }

  async function remove(id) {
    saving.value = true
    error.value = ''
    try {
      await api.delete(`/notes/${id}`)
      notes.value = notes.value.filter((n) => n.id !== id)
      return true
    } catch (e) {
      error.value = humanError(e, 'Impossible de supprimer la note. Veuillez réessayer.')
      return false
    } finally {
      saving.value = false
    }
  }

  return { notes, loading, saving, error, fetchAll, create, update, remove }
}
