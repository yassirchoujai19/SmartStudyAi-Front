<script setup>
import { Bot, User } from 'lucide-vue-next'
import { computed } from 'vue'
import { renderMarkdown } from '@/composables/useMarkdown'

const props = defineProps({
  message: { type: Object, required: true },
})

const isUser = computed(() => props.message.role === 'user')
const html = computed(() => renderMarkdown(props.message.content))
</script>

<template>
  <div class="flex gap-3" :class="isUser ? 'flex-row-reverse' : 'flex-row'">
    <span
      class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
      :class="isUser ? 'bg-slate-200 text-slate-600' : 'bg-brand-600 text-white'"
    >
      <component :is="isUser ? User : Bot" class="h-4 w-4" />
    </span>

    <div class="max-w-[min(42rem,85%)]">
      <p class="mb-1 text-xs font-medium text-slate-400" :class="isUser ? 'text-right' : ''">
        {{ isUser ? 'Vous' : 'SmartStudy AI' }}
      </p>
      <div
        class="chat-markdown rounded-2xl px-4 py-3 text-sm leading-relaxed"
        :class="
          isUser
            ? 'rounded-tr-sm bg-brand-600 text-white'
            : 'rounded-tl-sm border border-slate-200 bg-white text-slate-700'
        "
        v-html="html"
      />
    </div>
  </div>
</template>

<style scoped>
/* Tailwind v4 : nécessaire pour utiliser @apply dans un style scopé. */
@reference '../style.css';

.chat-markdown :deep(h3) {
  @apply mt-4 mb-1.5 text-sm font-semibold text-slate-900 first:mt-0;
}

.chat-markdown :deep(p) {
  @apply my-2 first:mt-0 last:mb-0;
}

.chat-markdown :deep(ul),
.chat-markdown :deep(ol) {
  @apply my-2 space-y-1 pl-5;
}

.chat-markdown :deep(ul) {
  @apply list-disc;
}

.chat-markdown :deep(ol) {
  @apply list-decimal;
}

.chat-markdown :deep(hr) {
  @apply my-3 border-slate-200;
}

.chat-markdown :deep(pre) {
  @apply my-2.5 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100;
}

.chat-markdown :deep(code) {
  @apply rounded bg-slate-100 px-1 py-0.5 text-[13px] text-slate-800;
}

.chat-markdown :deep(pre code) {
  @apply bg-transparent p-0 text-slate-100;
}

.chat-markdown :deep(table) {
  @apply my-2.5 w-full border-collapse text-[13px];
}

.chat-markdown :deep(th),
.chat-markdown :deep(td) {
  @apply border border-slate-200 px-2.5 py-1.5 text-left align-top;
}

.chat-markdown :deep(th) {
  @apply bg-slate-50 font-semibold text-slate-900;
}

/* Sur fond bleu (messages de l'étudiant), on garde un contraste lisible. */
.bg-brand-600.chat-markdown :deep(code) {
  @apply bg-brand-700 text-white;
}
</style>
