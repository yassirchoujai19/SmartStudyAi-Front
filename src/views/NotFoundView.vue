<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
    <p class="text-5xl font-bold text-brand-600">404</p>
    <h1 class="mt-4 text-xl font-semibold text-slate-900">Page introuvable</h1>
    <p class="mt-2 text-sm text-slate-500">Cette page n'existe pas ou a été déplacée.</p>
    <RouterLink
      to="/"
      class="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
    >
      Retour à l'accueil
    </RouterLink>
  </div>
</template>
