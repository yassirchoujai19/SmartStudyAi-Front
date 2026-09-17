<script setup>
import { SendHorizontal } from 'lucide-vue-next'
import { ref } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  sending: { type: Boolean, default: false },
})

const emit = defineEmits(['send'])
const text = ref('')

function submit() {
  const value = text.value.trim()
  if (!value) return
  emit('send', value)
  text.value = ''
}
</script>

<template>
  <form class="flex items-end gap-2" @submit.prevent="submit">
    <textarea
      v-model="text"
      rows="1"
      placeholder="Posez votre question..."
      class="max-h-40 flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      @keydown.enter.exact.prevent="submit"
    />
    <button
      type="submit"
      :disabled="sending || !text.trim()"
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Envoyer le message"
    >
      <LoadingSpinner v-if="sending" size="sm" />
      <SendHorizontal v-else class="h-4 w-4" />
    </button>
  </form>
</template>
