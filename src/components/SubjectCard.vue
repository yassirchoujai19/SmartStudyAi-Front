<script setup>
import { BookOpen, FileText, Pencil, Trash2 } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { formatDate } from '@/composables/useFormat'

defineProps({
  subject: { type: Object, required: true },
  showActions: { type: Boolean, default: true },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <article
    class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-3">
      <RouterLink
        :to="{ name: 'subject-detail', params: { id: subject.id } }"
        class="flex items-center gap-3"
      >
        <span class="rounded-xl bg-brand-50 p-2.5 text-brand-600">
          <BookOpen class="h-5 w-5" />
        </span>
        <h3 class="font-semibold text-slate-900 group-hover:text-brand-700">{{ subject.name }}</h3>
      </RouterLink>

      <div v-if="showActions" class="flex shrink-0 gap-1">
        <button
          type="button"
          class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Modifier la matière"
          @click="emit('edit', subject)"
        >
          <Pencil class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label="Supprimer la matière"
          @click="emit('delete', subject)"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
    </div>

    <p class="mt-3 line-clamp-2 min-h-10 text-sm text-slate-500">
      {{ subject.description || 'Aucune description.' }}
    </p>

    <footer class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
      <span class="flex items-center gap-1.5">
        <FileText class="h-3.5 w-3.5" />
        {{ subject.notes_count ?? subject.notes?.length ?? 0 }} note(s)
      </span>
      <span>{{ formatDate(subject.created_at) }}</span>
    </footer>
  </article>
</template>
