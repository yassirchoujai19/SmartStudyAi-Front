<script setup>
import { Menu } from 'lucide-vue-next'
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

defineProps({
  title: { type: String, default: '' },
})

const emit = defineEmits(['toggle-sidebar'])

const { user } = useAuth()

const initials = computed(() =>
  (user.value?.name ?? '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6"
  >
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
        aria-label="Ouvrir le menu"
        @click="emit('toggle-sidebar')"
      >
        <Menu class="h-5 w-5" />
      </button>
      <h1 class="text-base font-semibold text-slate-900 sm:text-lg">{{ title }}</h1>
    </div>

    <div class="flex items-center gap-3">
      <div class="hidden text-right sm:block">
        <p class="text-sm font-medium text-slate-900">{{ user?.name }}</p>
        <p class="text-xs text-slate-400">{{ user?.email }}</p>
      </div>
      <span
        class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
      >
        {{ initials }}
      </span>
    </div>
  </header>
</template>
