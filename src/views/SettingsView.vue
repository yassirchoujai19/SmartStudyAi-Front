<script setup>
import { LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <header>
      <h2 class="text-2xl font-bold text-slate-900">Paramètres</h2>
      <p class="mt-1 text-slate-500">Informations de votre compte.</p>
    </header>

    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 class="text-sm font-semibold text-slate-900">Compte</h3>

      <dl class="mt-4 space-y-3 text-sm">
        <div class="flex justify-between border-b border-slate-100 pb-3">
          <dt class="text-slate-500">Nom</dt>
          <dd class="font-medium text-slate-900">{{ user?.name }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-slate-500">Email</dt>
          <dd class="font-medium text-slate-900">{{ user?.email }}</dd>
        </div>
      </dl>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 class="text-sm font-semibold text-slate-900">Assistant IA</h3>
      <p class="mt-2 text-sm text-slate-500">
        Les questions sont envoyées à l'API Laravel, qui interroge le fournisseur d'IA. La clé
        d'API reste sur le serveur et n'est jamais exposée au navigateur. Sans clé configurée,
        l'assistant répond en mode démonstration.
      </p>
    </section>

    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
      @click="handleLogout"
    >
      <LogOut class="h-4 w-4" />
      Se déconnecter
    </button>
  </div>
</template>
