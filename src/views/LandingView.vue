<script setup>
import {
  ArrowRight,
  BookOpen,
  Bot,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { isAuthenticated } from '@/composables/useAuth'

const features = [
  {
    icon: BookOpen,
    title: 'Organisez vos matières',
    description:
      'Créez une fiche par matière, ajoutez une description et retrouvez tout au même endroit.',
  },
  {
    icon: FileText,
    title: 'Centralisez vos notes',
    description: 'Vos résumés de cours sont rattachés à une matière et modifiables à tout moment.',
  },
  {
    icon: Bot,
    title: 'Un assistant de révision',
    description:
      'Demandez une explication, un exemple, un résumé ou un quiz sur la matière de votre choix.',
  },
  {
    icon: ShieldCheck,
    title: 'Vos données protégées',
    description:
      "Authentification Laravel Sanctum : chaque étudiant ne voit que ses propres matières et notes.",
  },
]

const start = isAuthenticated() ? { name: 'dashboard' } : { name: 'register' }
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <header class="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <BookOpen class="h-4 w-4" />
          </span>
          <span class="font-semibold text-slate-900">SmartStudy AI</span>
        </RouterLink>

        <nav class="flex items-center gap-2">
          <RouterLink
            :to="{ name: 'login' }"
            class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Connexion
          </RouterLink>
          <RouterLink
            :to="start"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Commencer
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span
            class="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
          >
            <Sparkles class="h-3.5 w-3.5" />
            Assistant d'étude propulsé par l'IA
          </span>

          <h1 class="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Révisez mieux, avec vos cours et une IA à vos côtés.
          </h1>

          <p class="mt-5 max-w-xl text-lg text-slate-500">
            SmartStudy AI réunit vos matières, vos notes de cours et un assistant capable de vous
            expliquer un concept, de vous donner un exemple ou de générer un quiz de révision.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink
              :to="start"
              class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Commencer à apprendre
              <ArrowRight class="h-4 w-4" />
            </RouterLink>
            <a
              href="#fonctionnalites"
              class="inline-flex items-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Voir les fonctionnalités
            </a>
          </div>
        </div>

        <!-- Aperçu visuel de l'assistant -->
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div class="rounded-xl bg-white shadow-sm">
            <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span class="text-sm font-medium text-slate-900">Assistant IA</span>
              <span class="flex items-center gap-1.5 text-xs text-emerald-600">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                En ligne
              </span>
            </div>

            <div class="space-y-4 p-4">
              <div class="flex justify-end">
                <p class="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-2.5 text-sm text-white">
                  Explique-moi les migrations Laravel simplement.
                </p>
              </div>
              <div class="flex gap-2.5">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white"
                >
                  <Bot class="h-4 w-4" />
                </span>
                <p
                  class="max-w-[80%] rounded-2xl rounded-tl-sm border border-slate-200 px-4 py-2.5 text-sm text-slate-600"
                >
                  Une migration est un fichier qui décrit une modification de la base de données.
                  C'est l'équivalent d'un commit Git, mais appliqué à votre schéma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fonctionnalités -->
    <section id="fonctionnalites" class="border-t border-slate-100 bg-slate-50 py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 class="text-center text-3xl font-bold tracking-tight text-slate-900">
          Tout ce qu'il faut pour réviser
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-center text-slate-500">
          Une application simple : vos matières, vos notes, et un assistant disponible à tout moment.
        </p>

        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="feature in features"
            :key="feature.title"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <span class="inline-flex rounded-xl bg-brand-50 p-2.5 text-brand-600">
              <component :is="feature.icon" class="h-5 w-5" />
            </span>
            <h3 class="mt-4 font-semibold text-slate-900">{{ feature.title }}</h3>
            <p class="mt-2 text-sm text-slate-500">{{ feature.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Fonctionnement -->
    <section class="py-20">
      <div class="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 class="text-3xl font-bold tracking-tight text-slate-900">Comment ça marche</h2>

        <div class="mt-12 grid gap-6 sm:grid-cols-3">
          <div v-for="(step, index) in [
              'Créez vos matières et ajoutez vos notes de cours.',
              'Posez une question à l\'assistant, avec ou sans contexte de matière.',
              'Recevez une explication, un exemple ou un quiz de révision.',
            ]" :key="index" class="rounded-2xl border border-slate-200 p-6 text-left">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white"
            >
              {{ index + 1 }}
            </span>
            <p class="mt-4 text-sm text-slate-600">{{ step }}</p>
          </div>
        </div>

        <RouterLink
          :to="start"
          class="mt-12 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Commencer à apprendre
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
    </section>

    <!-- Pied de page -->
    <footer class="border-t border-slate-100 bg-white py-8">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-400 sm:flex-row sm:px-6"
      >
        <p>SmartStudy AI — Projet étudiant Vue.js, Laravel et IA.</p>
        <p>L'assistant est une aide à la révision, pas une source d'autorité.</p>
      </div>
    </footer>
  </div>
</template>
