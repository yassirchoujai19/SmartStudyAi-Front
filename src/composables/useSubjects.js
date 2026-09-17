import { ref } from 'vue'
import api, { humanError } from '@/services/api'

export function useSubjects() {
  const subjects = ref([])
  const subject = ref(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/subjects')
      subjects.value = data.data
    } catch (e) {
      error.value = humanError(e, 'Impossible de charger les matières. Veuillez réessayer.')
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get(`/subjects/${id}`)
      subject.value = data.data
    } catch (e) {
      error.value = humanError(e, 'Impossible de charger cette matière. Veuillez réessayer.')
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await api.post('/subjects', payload)
      subjects.value = [data.data, ...subjects.value]
      return data.data
    } catch (e) {
      error.value = humanError(e, 'Impossible de créer la matière. Veuillez réessayer.')
      return null
    } finally {
      saving.value = false
    }
  }

  async function update(id, payload) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await api.put(`/subjects/${id}`, payload)
      subjects.value = subjects.value.map((s) => (s.id === id ? data.data : s))
      if (subject.value?.id === id) {
        subject.value = { ...subject.value, ...data.data }
      }
      return data.data
    } catch (e) {
      error.value = humanError(e, 'Impossible de modifier la matière. Veuillez réessayer.')
      return null
    } finally {
      saving.value = false
    }
  }

  async function remove(id) {
    saving.value = true
    error.value = ''
    try {
      await api.delete(`/subjects/${id}`)
      subjects.value = subjects.value.filter((s) => s.id !== id)
      return true
    } catch (e) {
      error.value = humanError(e, 'Impossible de supprimer la matière. Veuillez réessayer.')
      return false
    } finally {
      saving.value = false
    }
  }

  return { subjects, subject, loading, saving, error, fetchAll, fetchOne, create, update, remove }
}
