<script setup>
import { TriangleAlert } from 'lucide-vue-next'
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmer la suppression' },
  message: { type: String, default: 'Cette action est irréversible.' },
  confirmLabel: { type: String, default: 'Supprimer' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      @click.self="emit('cancel')"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div class="flex items-start gap-3">
          <span class="rounded-xl bg-red-50 p-2.5 text-red-600">
            <TriangleAlert class="h-5 w-5" />
          </span>
          <div>
            <h3 class="text-base font-semibold text-slate-900">{{ title }}</h3>
            <p class="mt-1 text-sm text-slate-500">{{ message }}</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            @click="emit('cancel')"
          >
            Annuler
          </button>
          <button
            type="button"
            :disabled="loading"
            class="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
            @click="emit('confirm')"
          >
            <LoadingSpinner v-if="loading" size="sm" />
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
