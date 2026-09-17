<script setup>
import { BookOpen } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AlertMessage from '@/components/AlertMessage.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register, loading, error } = useAuth()

const form = ref({ name: '', email: '', password: '', password_confirmation: '' })

async function submit() {
  if (await register(form.value)) {
    router.push({ name: 'dashboard' })
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div class="w-full max-w-md">
      <RouterLink to="/" class="mb-8 flex items-center justify-center gap-2">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <BookOpen class="h-5 w-5" />
        </span>
        <span class="text-lg font-semibold text-slate-900">SmartStudy AI</span>
      </RouterLink>

      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 class="text-xl font-semibold text-slate-900">Créer un compte</h1>
        <p class="mt-1 text-sm text-slate-500">Quelques secondes suffisent pour commencer.</p>

        <AlertMessage v-if="error" :message="error" class="mt-5" />

        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label for="name" class="mb-1.5 block text-sm font-medium text-slate-700">Nom</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label for="email" class="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label for="password" class="mb-1.5 block text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="8"
              autocomplete="new-password"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <p class="mt-1 text-xs text-slate-400">8 caractères minimum.</p>
          </div>

          <div>
            <label for="confirm" class="mb-1.5 block text-sm font-medium text-slate-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm"
              v-model="form.password_confirmation"
              type="password"
              required
              autocomplete="new-password"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            <LoadingSpinner v-if="loading" size="sm" />
            Créer mon compte
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-500">
          Déjà inscrit ?
          <RouterLink :to="{ name: 'login' }" class="font-medium text-brand-600 hover:underline">
            Se connecter
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
