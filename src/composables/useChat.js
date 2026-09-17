import { ref } from 'vue'
import api, { humanError } from '@/services/api'

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Bonjour ! Je suis votre assistant d'étude. Posez-moi une question sur l'une de vos matières, demandez un résumé, un exemple ou un quiz de révision.",
}

export function useChat() {
  const messages = ref([WELCOME])
  const conversationId = ref(null)
  const conversations = ref([])
  const sending = ref(false)
  const loading = ref(false)
  const error = ref('')
  const aiMode = ref(null)

  async function fetchConversations() {
    try {
      const { data } = await api.get('/conversations')
      conversations.value = data.data
    } catch (e) {
      error.value = humanError(e, 'Impossible de charger les conversations.')
    }
  }

  async function openConversation(id) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get(`/conversations/${id}`)
      conversationId.value = data.data.id
      messages.value = data.data.messages.length ? data.data.messages : [WELCOME]
    } catch (e) {
      error.value = humanError(e, 'Impossible de charger cette conversation.')
    } finally {
      loading.value = false
    }
  }

  async function send(text, subjectId = null) {
    const content = text.trim()
    if (!content || sending.value) return

    error.value = ''
    sending.value = true
    messages.value = [
      ...messages.value.filter((m) => m.id !== 'welcome'),
      { id: `local-${Date.now()}`, role: 'user', content },
    ]

    try {
      const { data } = await api.post('/chat', {
        message: content,
        subject_id: subjectId || null,
        conversation_id: conversationId.value,
      })
      conversationId.value = data.conversation_id
      aiMode.value = data.ai_mode
      messages.value = [...messages.value, data.reply]
    } catch (e) {
      error.value = humanError(
        e,
        "L'assistant IA est temporairement indisponible. Veuillez réessayer.",
      )
    } finally {
      sending.value = false
    }
  }

  function reset() {
    messages.value = [WELCOME]
    conversationId.value = null
    error.value = ''
  }

  return {
    messages,
    conversations,
    conversationId,
    sending,
    loading,
    error,
    aiMode,
    fetchConversations,
    openConversation,
    send,
    reset,
  }
}
