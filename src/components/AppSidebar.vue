<script setup>
import {
  BookOpen,
  Bot,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
} from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const router = useRouter()
const { logout } = useAuth()

const links = [
  { name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { name: 'subjects', label: 'Matières', icon: BookOpen },
  { name: 'notes', label: 'Notes', icon: FileText },
  { name: 'chat', label: 'Assistant IA', icon: Bot },
]

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <!-- Voile affiché uniquement sur mobile quand le menu est ouvert -->
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
    @click="emit('close')"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex h-16 items-center justify-between border-b border-slate-100 px-5">
      <RouterLink to="/" class="flex items-center gap-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <BookOpen class="h-4 w-4" />
        </span>
        <span class="font-semibold text-slate-900">SmartStudy AI</span>
      </RouterLink>
      <button
        type="button"
        class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
        aria-label="Fermer le menu"
        @click="emit('close')"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <nav class="flex-1 space-y-1 p-3">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        active-class="bg-brand-50 text-brand-700 hover:bg-brand-50"
        @click="emit('close')"
      >
        <component :is="link.icon" class="h-4 w-4" />
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="space-y-1 border-t border-slate-100 p-3">
      <RouterLink
        :to="{ name: 'settings' }"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        active-class="bg-brand-50 text-brand-700 hover:bg-brand-50"
        @click="emit('close')"
      >
        <Settings class="h-4 w-4" />
        Paramètres
      </RouterLink>
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        @click="handleLogout"
      >
        <LogOut class="h-4 w-4" />
        Déconnexion
      </button>
    </div>
  </aside>
</template>
