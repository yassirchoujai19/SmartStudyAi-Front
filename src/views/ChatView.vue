<script setup>
import { Bot, MessageSquarePlus, RotateCcw } from 'lucide-vue-next'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AlertMessage from '@/components/AlertMessage.vue'
import ChatInput from '@/components/ChatInput.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import { useChat } from '@/composables/useChat'
import { useSubjects } from '@/composables/useSubjects'

const route = useRoute()
const { messages, conversations, sending, loading, error, aiMode, fetchConversations, openConversation, send, reset } =
  useChat()
const { subjects, fetchAll } = useSubjects()

const selectedSubject = ref(route.query.subject ?? '')
const scroller = ref(null)

const suggestions = [
  'Explique-moi ce concept simplement',
  'Donne-moi un exemple',
  'Fais-moi un résumé',
  'Crée un quiz',
  'Aide-moi à réviser',
]

onMounted(() => {
  fetchAll()
  fetchConversations()
})

// Défilement automatique vers le dernier message.
watch(
  [messages, sending],
  async () => {
    await nextTick()
    if (scroller.value) {
      scroller.value.scrollTop = scroller.value.scrollHeight
    }
  },
  { deep: true },
)

async function handleSend(text) {
  await send(text, selectedSubject.value || null)
  fetchConversations()
}

function startNew() {
  reset()
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[1fr_18rem]">
    <!-- Conversation -->
    <section
      class="flex h-[calc(100vh-10rem)] min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
    >
      <header class="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
        <div class="flex items-center gap-3">
          <span class="rounded-lg bg-brand-600 p-2 text-white">
            <Bot class="h-4 w-4" />
          </span>
          <div>
            <h2 class="text-sm font-semibold text-slate-900">SmartStudy AI</h2>
            <p class="text-xs text-slate-400">Assistant de révision</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="hidden items-center gap-1.5 text-xs text-emerald-600 sm:flex">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            En ligne
          </span>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            @click="startNew"
          >
            <RotateCcw class="h-3.5 w-3.5" />
            Effacer
          </button>
        </div>
      </header>

      <!-- Messages -->
      <div ref="scroller" class="flex-1 space-y-5 overflow-y-auto p-5">
        <ChatMessage v-for="(message, index) in messages" :key="message.id ?? index" :message="message" />

        <div v-if="sending" class="flex items-center gap-2 pl-11 text-sm text-slate-400">
          <span class="flex gap-1">
            <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
            <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
            <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
          </span>
          L'assistant rédige sa réponse…
        </div>
      </div>

      <!-- Saisie -->
      <footer class="space-y-3 border-t border-slate-200 bg-white p-4">
        <AlertMessage v-if="error" :message="error" />

        <div v-if="messages.length <= 1" class="flex flex-wrap gap-2">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            type="button"
            class="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            @click="handleSend(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <label for="chat-subject" class="text-xs text-slate-500">Contexte :</label>
          <select
            id="chat-subject"
            v-model="selectedSubject"
            class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none transition focus:border-brand-400"
          >
            <option value="">Aucune matière</option>
            <option v-for="subject in subjects" :key="subject.id" :value="String(subject.id)">
              {{ subject.name }}
            </option>
          </select>

          <span v-if="aiMode === 'demo'" class="text-xs text-amber-600">
            Mode démonstration (aucune clé IA configurée)
          </span>
        </div>

        <ChatInput :sending="sending" @send="handleSend" />
      </footer>
    </section>

    <!-- Historique -->
    <aside class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-900">Conversations</h3>
        <button
          type="button"
          class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600"
          aria-label="Nouvelle conversation"
          @click="startNew"
        >
          <MessageSquarePlus class="h-4 w-4" />
        </button>
      </div>

      <p v-if="!conversations.length" class="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-400">
        Votre assistant est prêt. Posez votre première question.
      </p>

      <ul v-else class="space-y-2">
        <li v-for="conversation in conversations" :key="conversation.id">
          <button
            type="button"
            :disabled="loading"
            class="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-brand-200 hover:shadow-sm disabled:opacity-60"
            @click="openConversation(conversation.id)"
          >
            <p class="line-clamp-2 text-xs font-medium text-slate-700">
              {{ conversation.title ?? 'Conversation' }}
            </p>
            <p class="mt-1 text-[11px] text-slate-400">
              {{ conversation.subject?.name ?? 'Sans matière' }} ·
              {{ conversation.messages_count }} message(s)
            </p>
          </button>
        </li>
      </ul>
    </aside>
  </div>
</template>
