<script setup>
import { Pencil, Trash2 } from 'lucide-vue-next'
import { formatDate } from '@/composables/useFormat'

defineProps({
  note: { type: Object, required: true },
  showSubject: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="font-semibold text-slate-900">{{ note.title }}</h3>
        <span
          v-if="showSubject && note.subject"
          class="mt-1 inline-block rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700"
        >
          {{ note.subject.name }}
        </span>
      </div>
      <div class="flex shrink-0 gap-1">
        <button
          type="button"
          class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Modifier la note"
          @click="emit('edit', note)"
        >
          <Pencil class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label="Supprimer la note"
          @click="emit('delete', note)"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
    </div>

    <p class="mt-3 line-clamp-3 whitespace-pre-line text-sm text-slate-500">{{ note.content }}</p>

    <p class="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
      Modifiée le {{ formatDate(note.updated_at) }}
    </p>
  </article>
</template>
