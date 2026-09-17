<script setup>
import { BookOpen } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AlertMessage from '@/components/AlertMessage.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, loading, error } = useAuth()

const form = ref({ email: '', password: '' })

async function submit() {
  if (await login(form.value)) {
    router.push(route.query.redirect || { name: 'dashboard' })
  }
}

function fillDemo() {
  form.value = { email: 'demo@smartstudy.ai', password: 'password' }
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
        <h1 class="text-xl font-semibold text-slate-900">Connexion</h1>
        <p class="mt-1 text-sm text-slate-500">Accédez à vos matières et à votre assistant.</p>

        <AlertMessage v-if="error" :message="error" class="mt-5" />

        <form class="mt-6 space-y-4" @submit.prevent="submit">
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
              autocomplete="current-password"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            <LoadingSpinner v-if="loading" size="sm" />
            Se connecter
          </button>
        </form>

        <button
          type="button"
          class="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          @click="fillDemo"
        >
          Utiliser le compte de démonstration
        </button>

        <p class="mt-6 text-center text-sm text-slate-500">
          Pas encore de compte ?
          <RouterLink :to="{ name: 'register' }" class="font-medium text-brand-600 hover:underline">
            Créer un compte
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
